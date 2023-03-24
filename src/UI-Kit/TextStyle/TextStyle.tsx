import * as React from 'react';

interface TextStyleProps {
  children: React.ReactNode;
  style: TextStyle;
}

const textStyles: {[key in TextStyle]: string} = {
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
  return <span className={textStyles[style]}>{children}</span>;
};
