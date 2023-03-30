import * as React from 'react';

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

interface TextStyleProps {
  children: React.ReactNode;
  style: TextStyle;
}

const textStylesMap: {[key in TextStyle]: string} = {
  Display: 'Text-Display',
  Title: 'Text-Title',
  Blockquote: 'Text-Blockquote',
  Heading: 'Text-Heading',
  Subheading: 'Text-Subheading',
  Body: 'Text-Body',
  Label: 'Text-Label',
  Meta: 'Text-Meta',
  Caption: 'Text-Caption',
  Button: 'Text-Button',
};

export const TextStyle = ({children, style}: TextStyleProps) => {
  return <span className={textStylesMap[style]}>{children}</span>;
};
