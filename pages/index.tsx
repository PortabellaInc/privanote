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

  console.log('getPreview', node);
  //Early return
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

interface PortabellaConfig {
  token: string;
  projectId: string;
  teamId: string;
}

function ConfigurationModal({
  onDismiss,
  onSubmit,
}: {
  onDismiss: () => void;
  onSubmit: (c: PortabellaConfig) => void;
}) {
  const ref = useRef(null);
  const [config, setConfig] = useState<PortabellaConfig>({
    token: '',
    projectId: '',
    teamId: '',
  });

  const updateConfig = (property: string, value: string) =>
    setConfig((c) => ({ ...c, [property]: value }));

  useEffect(() => {
    function handleClickOutside(event: any) {
      // @ts-ignore
      if (ref.current && !ref.current.contains(event.target)) {
        onDismiss();
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref.current]);

  return (
    // <!-- This example requires Tailwind CSS v2.0+ -->
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    --> */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        {/* <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    --> */}
        <div
          ref={ref}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                {/* <!-- Heroicon name: exclamation --> */}
                <img src="data:image/jpeg;base64,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" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-400"
                  id="modal-headline"
                >
                  Backup configuration
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    Setup PrivaNote configuration to write and read from
                    Portabella. This integration is end-to-end encrypted, read
                    more about it{' '}
                    <a
                      href="https://portabella.io/docs"
                      className="underline hover:text-gray-500"
                    >
                      here
                    </a>
                    .
                  </p>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="token"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Token
                  </label>
                  <div className="mt-1">
                    <input
                      id="token"
                      name="token"
                      required
                      className="appearance-none block w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={config.token}
                      onChange={(e) => updateConfig('token', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <label
                    htmlFor="Project ID"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Project ID
                  </label>
                  <div className="mt-1">
                    <input
                      id="project-id"
                      name="project-id"
                      required
                      className="appearance-none block w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={config.projectId}
                      onChange={(e) =>
                        updateConfig('projectId', e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="mt-2 mb-2">
                  <label
                    htmlFor="Team ID"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Team ID (optional)
                  </label>
                  <div className="mt-1">
                    <input
                      id="team-id"
                      name="team-id"
                      required
                      className="appearance-none block w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={config.teamId}
                      onChange={(e) => updateConfig('teamId', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => onSubmit(config)}
            >
              Activate
            </button>
            <button
              onClick={onDismiss}
              type="button"
              className="mt-3 w-full inline-flex justify-center shadow-sm px-4 py-2 text-base font-medium text-gray-300  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({
  onDismiss,
  onDelete,
}: {
  onDismiss: any;
  onDelete: any;
}) {
  const ref = useRef(null);
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        onDismiss();
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref.current]);

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    --> */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-700 opacity-75"></div>
        </div>

        {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        {/* <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    --> */}
        <div
          ref={ref}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                {/* <!-- Heroicon name: exclamation --> */}
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-300"
                  id="modal-headline"
                >
                  Delete note
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    Are you sure you want to delete this note? You won't be able
                    to recover it after doing so.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onDelete}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-800 text-base font-medium text-white hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete
            </button>
            <button
              onClick={onDismiss}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [displayConfig, setDisplayConfig] = useState(false);
  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
  const [pb, setPb] = useState<any>(null);

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
        await pb.addCard(id, card);
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
      await pb.deleteCard(activeId);
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
      fetched = Object.entries(cards).map(([id, card]) => ({
        id,
        text: safeParseJson(card.description),
        updatedAt: card.updatedAt,
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
    setNotes(fetched.sort((a, b) => a.updatedAt - b.updatedAt));
  }, [pb]);

  const initialisePortabella = useCallback(async (config: any) => {
    const { Project } = require('@portabella/sdk');
    const pb = new Project(config);
    await pb.fetchProject();
    setPb(pb);
    return pb;
  }, []);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (!activeId) {
      setValue(defaultValue);
      return;
    }

    setValue(notes.find((n) => n.id === activeId).text);
  }, [activeId]);

  // @ts-ignore
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

  return (
    <>
      {displayConfig && (
        <ConfigurationModal
          onDismiss={() => setDisplayConfig(false)}
          onSubmit={async (config) => {
            await configDB.setItem('portabella', config);
            const pb = await initialisePortabella(config);
            await Promise.all(notes.map((n) => pb.addCard(n)));
          }}
        />
      )}
      {displayDeleteModal && (
        <DeleteModal
          onDismiss={() => setDisplayDeleteModal(false)}
          onSubmit={onDelete}
        />
      )}
      <div className="flex max-w-screen-lg mx-auto px-4 py-10 space-x-12">
        <div className="w-3/12" style={{ minWidth: '12rem' }}>
          <div className="mb-2 font-medium text-xl text-gray-300">
            PrivaNote 📖
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
            <a href="https://portabella.io" className="text-purple-400">
              Portabella
            </a>{' '}
            to encrypt and store your data.
          </div>

          <div className="mb-4 text-sm text-gray-400">
            <button
              onClick={() => setDisplayConfig(true)}
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
