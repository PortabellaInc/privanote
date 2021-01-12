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
import React, { useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact } from 'slate-react';

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

export const initialValuePreview: SlateDocument = [
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

const withPlugins = [withReact, withHistory];
const Example = () => {
  const plugins: any[] = [
    ParagraphPlugin(options),
    HeadingPlugin(options),
    PreviewPlugin(),
  ];

  const createReactEditor = () => () => {
    const [value, setValue] = useState(initialValuePreview);
    // @ts-ignore
    const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

    return (
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => setValue(newValue as SlateDocument)}
      >
        <EditablePlugins
          style={{ minHeight: '400px' }}
          plugins={plugins}
          placeholder="Write some markdown..."
        />
      </Slate>
    );
  };

  const Editor = createReactEditor();

  return <Editor />;
};

export default function Home(props) {
  return (
    <div className="flex max-w-screen-lg mx-auto px-4 py-10 space-x-12">
      <div className="w-3/12" style={{ minWidth: '12rem' }}>
        <div className="mb-8 font-medium text-xl text-gray-300">
          QuickNote 📖
        </div>

        <div className="mb-2 text-gray-400 text-sm">What's this?</div>
        <div className="mb-4 text-gray-400 text-sm">
          QuickNote is a privacy first, end-to-end encrypted note taking
          solution powered by{' '}
          <span className="text-purple-400">Portabella</span>. Designed for when
          you have an idea and you want to get it down fast!
        </div>

        <div className="mb-2 text-gray-400 text-sm">How does it work?</div>
        <div className="mb-4 text-gray-400 text-sm">
          Leveraging the{' '}
          <a
            target="_blank"
            href="https://github.com/portabellainc/sdk"
            className="bg-gray-600 text-gray-200 rounded p-1"
          >
            @portabella/sdk
          </a>{' '}
          everything is encrypted in your browser before being sent there.
        </div>

        <div className="mb-2 text-gray-400 text-sm">How do I sign up?</div>
        <div className="mb-2 text-gray-400 text-sm">
          To use QuickNote you need a Portabella account, you can sign up{' '}
          <a
            className="text-blue-400 text-blue-500 cursor-pointer"
            target="_blank"
          >
            here
          </a>
          .
        </div>
      </div>

      <div className="w-9/12">
        <Example />

        <button className="flex ml-auto mt-8 bg-indigo-500 hover:bg-indigo-600 transition px-4 py-2 rounded">
          Submit note
        </button>
      </div>
    </div>
  );
}
