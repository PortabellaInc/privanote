import {
  DEFAULTS_ALIGN,
  DEFAULTS_BLOCKQUOTE,
  DEFAULTS_BOLD,
  DEFAULTS_CODE,
  DEFAULTS_CODE_BLOCK,
  DEFAULTS_HEADING,
  DEFAULTS_ITALIC,
  DEFAULTS_LIST,
  DEFAULTS_PARAGRAPH,
  DEFAULTS_STRIKETHROUGH,
  DEFAULTS_UNDERLINE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  setDefaults,
  SlateDocument,
} from '@udecode/slate-plugins';

export const headingTypes = [
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
];

export const options = {
  ...setDefaults(DEFAULTS_PARAGRAPH, {}),
  ...setDefaults(DEFAULTS_BLOCKQUOTE, {}),
  ...setDefaults(DEFAULTS_CODE_BLOCK, {}),
  ...setDefaults(DEFAULTS_LIST, {}),
  ...setDefaults(DEFAULTS_HEADING, {}),
  ...setDefaults(DEFAULTS_ALIGN, {}),
  ...setDefaults(DEFAULTS_BOLD, {}),
  ...setDefaults(DEFAULTS_ITALIC, {}),
  ...setDefaults(DEFAULTS_UNDERLINE, {}),
  ...setDefaults(DEFAULTS_STRIKETHROUGH, {}),
  ...setDefaults(DEFAULTS_CODE, {}),
};

export const inlineTypes = [];

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
