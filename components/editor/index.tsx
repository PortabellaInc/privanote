import { CodeAlt } from '@styled-icons/boxicons-regular/CodeAlt';
import { CodeBlock } from '@styled-icons/boxicons-regular/CodeBlock';
import {
  FormatAlignCenter,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatStrikethrough,
  FormatUnderlined,
  Image,
  Link,
  Looks3,
  Looks4,
  Looks5,
  Looks6,
  LooksOne,
  LooksTwo,
} from '@styled-icons/material';
import {
  AlignPlugin,
  BalloonToolbar,
  BlockquotePlugin,
  BoldPlugin,
  CodeBlockPlugin,
  CodePlugin,
  EditablePlugins,
  ExitBreakPlugin,
  HeadingPlugin,
  HeadingToolbar,
  HighlightPlugin,
  ItalicPlugin,
  LinkPlugin,
  ListPlugin,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
  ParagraphPlugin,
  pipe,
  SlateDocument,
  SoftBreakPlugin,
  StrikethroughPlugin,
  ToolbarAlign,
  ToolbarElement,
  ToolbarImage,
  ToolbarLink,
  ToolbarList,
  ToolbarMark,
  UnderlinePlugin,
  withInlineVoid,
  withLink,
  withList,
  withMarks,
  withAutoformat,
} from '@udecode/slate-plugins';
import { useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact } from 'slate-react';
import { headingTypes, options } from './options';
import { autoformatRules } from './autoformat';

export { defaultValue } from './options';

const plugins: any[] = [
  ParagraphPlugin(options),
  BlockquotePlugin(options),
  HeadingPlugin(options),
  // LinkPlugin({
  //   ...options,
  //   link: {
  //     ...options.link,
  //   },
  // }),
  ListPlugin(options),
  CodeBlockPlugin(options),
  AlignPlugin(options),
  BoldPlugin(options),
  CodePlugin(options),
  ItalicPlugin(options),
  HighlightPlugin(options),
  UnderlinePlugin(options),
  StrikethroughPlugin(options),
  SoftBreakPlugin({
    rules: [
      // { hotkey: 'shift+enter' },
      {
        hotkey: 'enter',
        query: {
          allow: [options.code_block.type, options.blockquote.type],
        },
      },
    ],
  }),
  ExitBreakPlugin({
    rules: [
      {
        hotkey: 'shift+enter',
      },
      {
        hotkey: 'mod+enter',
      },
      {
        hotkey: 'mod+shift+enter',
        before: true,
      },
      {
        hotkey: 'enter',
        query: {
          start: true,
          end: true,
          allow: headingTypes,
        },
      },
    ],
  }),
];

const withPlugins = [
  withReact,
  withHistory,
  // withLink({link: {type: ''}}),
  withList(options),
  withMarks(),
  withAutoformat({ rules: autoformatRules }),

  withInlineVoid({ plugins }),
] as const;

export default function SlateEditor({
  value,
  onChange,
  onBlur,
}: {
  value: SlateDocument;
  onChange: (x: SlateDocument) => void;
  onBlur: () => void;
}) {
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => {
        onChange(newValue as SlateDocument);
      }}
    >
      <HeadingToolbar
        styles={{
          root: { flexWrap: 'wrap', border: '0px', paddingBottom: '0px' },
        }}
      >
        {/* Elements */}
        <ToolbarElement
          type={options.h1.type}
          icon={<LooksOne className="text-gray-400" />}
        />
        <ToolbarElement
          type={options.h2.type}
          icon={<LooksTwo className="text-gray-400" />}
        />
        <ToolbarElement
          type={options.h3.type}
          icon={<Looks3 className="text-gray-400" />}
        />
        <ToolbarElement
          type={options.h4.type}
          icon={<Looks4 className="text-gray-400" />}
        />
        <ToolbarElement
          type={options.h5.type}
          icon={<Looks5 className="text-gray-400" />}
        />
        <ToolbarElement
          type={options.h6.type}
          icon={<Looks6 className="text-gray-400" />}
        />
        <ToolbarList
          {...options}
          typeList={options.ul.type}
          icon={<FormatListBulleted className="text-gray-400" />}
        />
        <ToolbarList
          {...options}
          typeList={options.ol.type}
          icon={<FormatListNumbered className="text-gray-400" />}
        />
        <ToolbarElement
          type={options.blockquote.type}
          icon={<FormatQuote className="text-gray-400" />}
        />
        <ToolbarElement
          type={options.code_block.type}
          icon={<CodeBlock className="text-gray-400" />}
        />

        {/* Marks */}
        <ToolbarMark
          type={MARK_BOLD}
          icon={<FormatBold className="text-gray-400" />}
        />
        <ToolbarMark
          type={MARK_ITALIC}
          icon={<FormatItalic className="text-gray-400" />}
        />
        <ToolbarMark
          type={MARK_UNDERLINE}
          icon={<FormatUnderlined className="text-gray-400" />}
        />
        <ToolbarMark
          type={MARK_STRIKETHROUGH}
          icon={<FormatStrikethrough className="text-gray-400" />}
        />
        <ToolbarMark
          type={MARK_CODE}
          icon={<CodeAlt className="text-gray-400" />}
        />

        <ToolbarAlign icon={<FormatAlignLeft className="text-gray-400" />} />
        <ToolbarAlign
          type={options.align_center.type}
          icon={<FormatAlignCenter className="text-gray-400" />}
        />
        <ToolbarAlign
          type={options.align_right.type}
          icon={<FormatAlignRight className="text-gray-400" />}
        />

        {/* <ToolbarLink {...options} icon={<Link className="text-gray-400" />} /> */}
      </HeadingToolbar>
      <EditablePlugins
        onBlur={onBlur}
        plugins={plugins}
        placeholder="Enter some plain text..."
        style={{ minHeight: '300px', height: '100%' }}
      />
    </Slate>
  );
}
