import localForage from 'localforage';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PortabellaConfig } from '@portabella/sdk';
import {
  ConfigurationModal,
  defaultValue,
  DeleteModal,
  WelcomeModal,
} from '../components';
const SlateEditor = dynamic(() => import('../components/editor'), {
  ssr: false,
});

function safeParseJson(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

const notesDB = localForage.createInstance({ name: 'privanote/notes' });
const configDB = localForage.createInstance({ name: 'privanote/config' });

function getPreview(node: any) {
  if (!node) {
    return null;
  }

  // Early return
  if (node.text) {
    if (node.text.length >= 20) {
      return `${node.text.slice(0, 20).trim()}...`;
    }
    return node.text.trim();
  }

  var result, p;
  for (p in node) {
    if (node.hasOwnProperty(p) && typeof node[p] === 'object') {
      result = getPreview(node[p]);
      if (result) {
        return result;
      }
    }
  }
  return result;
}

const hasSeenConfigKey = 'hasSeenConfig';
const portabellaConfigKey = 'portabella';

interface Note {
  id: string;
  updatedAt: number;
  text: any;
}

let lastBlurredValue: string = '';

const d = console.log;

const getLocalCards = async () => {
  const localKeys = await notesDB.keys();
  return Promise.all(
    localKeys.map(async (key) => {
      const { updatedAt, text } = await notesDB.getItem(key);
      return { id: key, updatedAt, text: safeParseJson(text) };
    })
  );
};

export default function Home() {
  const [value, setValue] = useState(defaultValue);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState('');
  const [displayConfigModal, setDisplayConfigModal] = useState(false);
  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
  const [displayWelcomeModal, setDisplayWelcomeModal] = useState(false);
  const [pb, setPb] = useState<any>(null);
  const [config, setConfig] = useState<PortabellaConfig | null>(null);
  const [portabellaLoaded, setPortabellaLoaded] = useState(false);

  const onBlur = useCallback(async () => {
    const preview = getPreview(value);
    if (!preview) {
      d('onBlur: no preview, returning');
      return;
    }

    const text = JSON.stringify(value);
    if (text === lastBlurredValue) {
      d('onBlur: matching value, returning');
      return;
    }

    lastBlurredValue = text;

    const card = { text, updatedAt: Date.now() };
    if (activeId) {
      d('onBlur: local update');
      await notesDB.setItem(activeId, card);
      if (pb) {
        d('onBlur: portabella update');
        pb.updateCard(activeId, { title: preview, description: text });
      }
    } else {
      d('onBlur: local add');
      const id = uuidv4();
      await notesDB.setItem(id, card);
      setActiveId(id);
      if (pb) {
        d('onBlur: portabella add');
        pb.addCard({ id, title: preview, description: text });
      }
    }

    fetchLocalItems();
  }, [value, pb, activeId]);

  const onDelete = useCallback(async () => {
    await notesDB.removeItem(activeId);
    if (pb) {
      pb.removeCard(activeId);
    }
    fetchLocalItems();
    setActiveId('');
  }, [activeId, pb]);

  const sync = useCallback(async () => {
    const getRemoteCards = async () => {
      if (!pb) {
        return [];
      }
      const { cards } = await pb.fetchProject();
      d(`fetchItems: portabella`, Object.keys(cards).length);
      return Object.entries(cards)
        .filter(([_, card]) => Boolean((card as any).description))
        .map(([id, card]) => ({
          id,
          text: safeParseJson((card as any).description),
          updatedAt: (card as any).updatedAt,
        }));
    };

    const [local, remote] = await Promise.all([
      getLocalCards(),
      getRemoteCards(),
    ]);

    if (pb) {
      // sync with backend
      const missingRemote = local.filter(
        (x) => !remote.find((y) => x.id === y.id)
      );
      const missingLocal = remote.filter(
        (x) => !local.find((y) => x.id === y.id)
      );

      await Promise.all(
        missingLocal.map((loc) => notesDB.setItem(loc.id, loc))
      );
      await Promise.all(
        missingRemote.map((rem) =>
          pb.addCard({
            id: rem.id,
            title: getPreview(rem.text),
            description: rem.text,
          })
        )
      );
    }
  }, [pb]);

  const initialisePortabella = useCallback(async (config: any) => {
    d('initialisePortabella');
    const { ProjectSDK } = require('@portabella/sdk');
    const pb = new ProjectSDK(config);
    await pb.fetchProject();
    setPb(pb);
    return pb;
  }, []);

  const fetchLocalItems = useCallback(async () => {
    const local = await getLocalCards();
    setNotes(local.sort((a, b) => b.updatedAt - a.updatedAt));
  }, []);

  useEffect(() => {
    if (!portabellaLoaded) {
      return;
    }
    async function f() {
      await sync();
      fetchLocalItems();
    }
    f();
  }, [portabellaLoaded, sync, fetchLocalItems]);

  useEffect(() => {
    let timeout = null;

    async function f() {
      // after 2 minutes we want to prompt to sign up for Portabella
      timeout = setTimeout(async () => {
        const hasSeenConfigAfterTimeout = await configDB.getItem(
          hasSeenConfigKey
        );
        if (!hasSeenConfigAfterTimeout) {
          setDisplayWelcomeModal(true);
        }
      }, 1000 * 60 * 2);

      const config = await configDB.getItem(portabellaConfigKey);
      if (config) {
        setConfig(config);
        await initialisePortabella(config);
      }

      setPortabellaLoaded(true);
    }
    f();

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  useEffect(() => {
    const beforeUnload = (e: any) => {
      e.preventDefault();
      onBlur();
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [onBlur]);

  useEffect(() => {
    if (!activeId) {
      setValue(defaultValue);
      return;
    }

    const note = notes.find((n) => n.id === activeId);
    if (!note) {
      return;
    }

    setValue(note.text);
  }, [activeId]);

  return (
    <>
      {displayConfigModal && (
        <ConfigurationModal
          config={config}
          onDismiss={async () => {
            setDisplayConfigModal(false);
            await configDB.setItem(hasSeenConfigKey, true);
          }}
          onSubmit={async (config) => {
            await configDB.setItem(portabellaConfigKey, config);
            initialisePortabella(config);
          }}
          onDelete={async () => {
            await configDB.removeItem(portabellaConfigKey);
            setPb(null);
            setConfig(null);
          }}
        />
      )}
      {displayDeleteModal && (
        <DeleteModal
          onDismiss={() => setDisplayDeleteModal(false)}
          onDelete={onDelete}
        />
      )}
      {displayWelcomeModal && (
        <WelcomeModal
          onDismiss={async () => {
            await configDB.setItem(hasSeenConfigKey, true);
            setDisplayWelcomeModal(false);
          }}
          onSubmit={async () => {
            await configDB.setItem(hasSeenConfigKey, true);
            setDisplayWelcomeModal(false);
            setDisplayConfigModal(true);
          }}
        />
      )}
      <div className="flex flex-col-reverse md:flex-row max-w-screen-lg mx-auto px-4 md:space-x-12">
        <div
          className="md:w-3/12 mt-10 md:mt-0 py-4 md:py-10"
          style={{ minWidth: '12rem' }}
        >
          <div className="flex items-center mb-2 font-medium text-xl text-gray-300">
            PrivaNote{' '}
            <img
              src={'/logo.png'}
              height={20}
              width={'20px'}
              className="ml-2"
            />
          </div>

          <div className="mb-4 text-gray-400 text-sm">
            A privacy friendly, offline first, end-to-end encrypted note taking
            application.
          </div>

          <div className="mb-2 text-gray-300 text-sm font-medium">
            How does it work?
          </div>
          <div className="mb-2 text-gray-400 text-sm">
            PrivaNote stores data locally in your browsers IndexedDB (with a
            fallback to LocalStorage).
          </div>

          <div className="mb-2 text-gray-400 text-sm">
            If you choose to enable backups, PrivaNote uses{' '}
            <a
              href="https://portabella.io"
              className="text-brand-500"
              target="_blank"
            >
              Portabella
            </a>{' '}
            to encrypt and store your data.
          </div>

          <div className="mb-4 text-sm text-gray-400">
            <button
              onClick={() => setDisplayConfigModal(true)}
              className="focus:outline-none underline hover:text-gray-500"
            >
              Click here
            </button>{' '}
            to setup your Portabella configuration.
          </div>

          <div className="mb-2 text-gray-300 text-sm font-medium">Notes</div>

          <button
            onClick={() => setActiveId('')}
            className={`p-2 ${
              !activeId
                ? 'bg-gray-700'
                : 'hover:bg-gray-700 cursor-pointer text-gray-400'
            } transition text-sm rounded w-full mb-1`}
          >
            New +
          </button>
          {notes.length > 0 &&
            notes.map((n) => (
              <div
                key={n.id}
                className={`p-2 ${
                  activeId === n.id
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-700 cursor-pointer text-gray-400'
                } transition text-sm rounded flex items-center justify-between`}
                onClick={() => setActiveId(n.id)}
              >
                <span className="italic">
                  {getPreview(n.text) || 'No preview available'}
                </span>

                {activeId === n.id && (
                  <button
                    className="px-2"
                    onClick={() => setDisplayDeleteModal(true)}
                  >
                    <svg
                      className="text-gray-400"
                      style={{ height: '1.3em' }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
        </div>

        <div className="md:w-9/12">
          <SlateEditor
            onChange={(newValue) => setValue(newValue)}
            onBlur={onBlur}
            value={value}
          />
        </div>
      </div>
    </>
  );
}
