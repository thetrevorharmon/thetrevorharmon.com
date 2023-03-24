const textSizeClasses: {[key in TextStyle]: string} = {
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

export function getTextStyle(style: TextStyle) {
  return textSizeClasses[style];
}
