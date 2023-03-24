const headerStyles = [
  'Display',
  'Title',
  'Blockquote',
  'Heading',
  'Subheading',
] as const;

const textStyles = [
  ...headerStyles,
  'Body',
  'Label',
  'Meta',
  'Caption',
  'Button',
] as const;

type TextStyle = (typeof textStyles)[number];
type HeaderStyle = (typeof headerStyles)[number];

const supportedColors = [
  'primary',
  'primary-focus',
  'primary-text',
  'primary-text-focus',
  'text',
  'text-bold',
  'text-muted',
  'caption-bg',
  'body-bg',
  'img-border',
  'accent-line',
] as const;

type Color = (typeof supportedColors)[number];
type ColorType = 'fill' | 'text';
type ColorPseudoState = 'normal' | 'hover' | 'focus';
