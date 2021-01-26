import {
  DEFAULTS_ALIGN,
  DEFAULTS_BLOCKQUOTE,
  DEFAULTS_BOLD,
  DEFAULTS_CODE,
  DEFAULTS_CODE_BLOCK,
  DEFAULTS_HEADING,
  DEFAULTS_HIGHLIGHT,
  DEFAULTS_IMAGE,
  DEFAULTS_ITALIC,
  DEFAULTS_KBD,
  DEFAULTS_LINK,
  DEFAULTS_LIST,
  DEFAULTS_MEDIA_EMBED,
  DEFAULTS_MENTION,
  DEFAULTS_PARAGRAPH,
  DEFAULTS_SEARCH_HIGHLIGHT,
  DEFAULTS_STRIKETHROUGH,
  DEFAULTS_SUBSUPSCRIPT,
  DEFAULTS_TABLE,
  DEFAULTS_TODO_LIST,
  DEFAULTS_UNDERLINE,
  EditablePlugins,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  HeadingPlugin,
  ParagraphPlugin,
  pipe,
  PreviewPlugin,
  SlateDocument,
} from '@udecode/slate-plugins';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, useSelected, withReact } from 'slate-react';

import { DeleteModal, ConfigurationModal, WelcomeModal } from '../components';
import { v4 as uuidv4 } from 'uuid';
import localForage from 'localforage';

export const headingTypes = [
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
];

export const options = {
  ...DEFAULTS_PARAGRAPH,
  ...DEFAULTS_MENTION,
  ...DEFAULTS_BLOCKQUOTE,
  ...DEFAULTS_CODE_BLOCK,
  ...DEFAULTS_LINK,
  ...DEFAULTS_IMAGE,
  ...DEFAULTS_MEDIA_EMBED,
  ...DEFAULTS_TODO_LIST,
  ...DEFAULTS_TABLE,
  ...DEFAULTS_LIST,
  ...DEFAULTS_HEADING,
  ...DEFAULTS_ALIGN,
  // marks
  ...DEFAULTS_BOLD,
  ...DEFAULTS_ITALIC,
  ...DEFAULTS_UNDERLINE,
  ...DEFAULTS_STRIKETHROUGH,
  ...DEFAULTS_CODE,
  ...DEFAULTS_KBD,
  ...DEFAULTS_SUBSUPSCRIPT,
  ...DEFAULTS_HIGHLIGHT,
  ...DEFAULTS_SEARCH_HIGHLIGHT,
};

export const defaultValue: SlateDocument = [
  {
    children: [
      {
        type: options.p.type,
        children: [
          {
            text: '',
          },
        ],
      },
    ],
  },
];

function safeParseJson(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

const withPlugins = [withReact, withHistory];
const plugins: any[] = [
  ParagraphPlugin(options),
  HeadingPlugin(options),
  PreviewPlugin(),
];

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
  text: string;
}

let lastBlurredValue: string = '';

const d = console.log;

export default function Home() {
  const [value, setValue] = useState(defaultValue);
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [displayConfigModal, setDisplayConfigModal] = useState(false);
  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
  const [displayWelcomeModal, setDisplayWelcomeModal] = useState(false);
  const [pb, setPb] = useState<any>(null);
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

    if (pb) {
      const card = { title: preview, description: text };
      if (activeId) {
        d('onBlur: portabella update');
        await pb.updateCard(activeId, card);
      } else {
        d('onBlur: portabella add');
        const id = uuidv4();
        await pb.addCard({ id, ...card });
        setActiveId(id);
      }
    } else {
      const card = { text, updatedAt: Date.now() };
      if (activeId) {
        d('onBlur: local update');
        await notesDB.setItem(activeId, card);
      } else {
        d('onBlur: local add');
        const id = uuidv4();
        await notesDB.setItem(id, card);
        setActiveId(id);
      }
    }

    fetchItems();
  }, [value, pb, activeId]);

  const onDelete = useCallback(async () => {
    if (pb) {
      await pb.removeCard(activeId);
    } else {
      await notesDB.removeItem(activeId);
    }
    fetchItems();
    setActiveId('');
  }, [activeId]);

  const fetchItems = useCallback(async () => {
    let fetched: Note[] = [];
    if (pb) {
      const { cards } = await pb.fetchProject();
      d(`fetchItems: portabella`);
      fetched = Object.entries(cards)
        .filter(([_, card]) => Boolean((card as any).description))
        .map(([id, card]) => ({
          id,
          text: safeParseJson((card as any).description),
          updatedAt: new Date((card as any).updatedAt).getTime(),
        }));
    } else {
      d(`fetchItems: local`);
      const keys = await notesDB.keys();
      if (!keys) {
        return;
      }
      fetched = await Promise.all(
        keys.map(async (key) => {
          const { updatedAt, text } = await notesDB.getItem(key);
          return { id: key, updatedAt, text: safeParseJson(text) };
        })
      );
    }

    d(`fetchItems: ${fetched.length} items`);
    setNotes(fetched.sort((a, b) => b.updatedAt - a.updatedAt));
  }, [pb]);

  const initialisePortabella = useCallback(async (config: any) => {
    d('initialisePortabella');
    const { ProjectSDK } = require('@portabella/sdk');
    const pb = new ProjectSDK(config);
    setPb(pb);
    return pb;
  }, []);

  useEffect(() => {
    if (!portabellaLoaded) {
      return;
    }
    fetchItems();
  }, [portabellaLoaded, fetchItems]);

  useEffect(() => {
    let timeout = null;

    async function f() {
      const hasSeenConfig = await configDB.getItem('hasSeenConfig');

      // after 10 seconds we want to prompt to sign up for Portabella
      timeout = setTimeout(async () => {
        const hasSeenConfigAfterTimeout = await configDB.getItem(
          hasSeenConfigKey
        );
        if (!hasSeenConfigAfterTimeout) {
          setDisplayWelcomeModal(true);
        }
      }, 10000);

      const config = await configDB.getItem(portabellaConfigKey);
      if (config) {
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

  // @ts-ignore
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

  return (
    <>
      {displayConfigModal && (
        <ConfigurationModal
          onDismiss={async () => {
            setDisplayConfigModal(false);
            await configDB.setItem(hasSeenConfigKey, true);
          }}
          onSubmit={async (config) => {
            await configDB.setItem(portabellaConfigKey, config);
            const pb = await initialisePortabella(config);
            await Promise.all(
              notes.map((n) =>
                pb.addCard({
                  n,
                  title: getPreview(n.text),
                  description: JSON.stringify(n.text),
                })
              )
            );
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
      <div className="flex max-w-screen-lg mx-auto px-4 py-10 space-x-12">
        <div className="w-3/12" style={{ minWidth: '12rem' }}>
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
            <a href="https://portabella.io" className="text-brand-500">
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

        <div className="w-9/12">
          <Slate
            editor={editor}
            value={value}
            onChange={(newValue) => setValue(newValue as SlateDocument)}
          >
            <EditablePlugins
              onBlur={onBlur}
              autoFocus
              style={{ minHeight: '100%' }}
              plugins={plugins}
              placeholder="Write some markdown..."
            />
          </Slate>
        </div>
      </div>
    </>
  );
}
