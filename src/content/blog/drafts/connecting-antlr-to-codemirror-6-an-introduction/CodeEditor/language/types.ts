const supportedTokens = [
  'const',
  'let',
  'semicolon',
  'assign',
  'blockComment',
  'lineComment',
  'number',
  'string',
  'identifier',
  'unknown',
] as const;

export type Token = (typeof supportedTokens)[number];
