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
  LinkPlugin({
    link: {
      ...options.link,
      nodeToProps: ({ element }) => ({
        ...element.attributes,
        target: '_blank',
      }),
    },
  }),
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
  // withLink({
  //   link: {
  //     ...options.link,
  //     // @ts-ignore
  //     attributes: {
  //       // @ts-ignore
  //       ...options.link.attributes,
  //       target: '_blank',
  //     },
  //     // component: (a) => {
  //     //   console.log(a);
  //     //   return <a href={a.element.url}>hello</a>;
  //     // },
  //   },
  // }),
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
          root: {
            flexWrap: 'wrap',
            border: '0px',
            paddingBottom: '0px',
            paddingTop: '1em',
            position: 'sticky',
            top: 0,
            background: '#1F2937', // bg-gray-800
            zIndex: 5,
          },
        }}
      >
        {/* Elements */}
        <ToolbarElement
          type={options.h1.type}
          className="text-gray-400"
          icon={<LooksOne />}
        />
        <ToolbarElement
          type={options.h2.type}
          className="text-gray-400"
          icon={<LooksTwo />}
        />
        <ToolbarElement
          type={options.h3.type}
          className="text-gray-400"
          icon={<Looks3 />}
        />
        <ToolbarElement
          type={options.h4.type}
          className="text-gray-400"
          icon={<Looks4 />}
        />
        <ToolbarElement
          type={options.h5.type}
          className="text-gray-400"
          icon={<Looks5 />}
        />
        <ToolbarElement
          type={options.h6.type}
          className="text-gray-400"
          icon={<Looks6 />}
        />
        <ToolbarList
          {...options}
          typeList={options.ul.type}
          className="text-gray-400"
          icon={<FormatListBulleted />}
        />
        <ToolbarList
          {...options}
          typeList={options.ol.type}
          className="text-gray-400"
          icon={<FormatListNumbered />}
        />
        <ToolbarElement
          type={options.blockquote.type}
          className="text-gray-400"
          icon={<FormatQuote />}
        />
        <ToolbarElement
          type={options.code_block.type}
          className="text-gray-400"
          icon={<CodeBlock />}
        />

        {/* Marks */}
        <ToolbarMark
          type={MARK_BOLD}
          className="text-gray-400"
          icon={<FormatBold />}
        />
        <ToolbarMark
          type={MARK_ITALIC}
          className="text-gray-400"
          icon={<FormatItalic />}
        />
        <ToolbarMark
          type={MARK_UNDERLINE}
          className="text-gray-400"
          icon={<FormatUnderlined />}
        />
        <ToolbarMark
          type={MARK_STRIKETHROUGH}
          className="text-gray-400"
          icon={<FormatStrikethrough />}
        />
        <ToolbarMark
          type={MARK_CODE}
          className="text-gray-400"
          icon={<CodeAlt />}
        />

        <ToolbarAlign className="text-gray-400" icon={<FormatAlignLeft />} />
        <ToolbarAlign
          type={options.align_center.type}
          className="text-gray-400"
          icon={<FormatAlignCenter />}
        />
        <ToolbarAlign
          type={options.align_right.type}
          className="text-gray-400"
          icon={<FormatAlignRight />}
        />

        <ToolbarLink {...options} className="text-gray-400" icon={<Link />} />
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
