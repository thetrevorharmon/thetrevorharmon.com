import {CharStreams, CommonTokenStream} from 'antlr4ts';
import {ZephyrLexer} from './build/ZephyrLexer';

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

const lexerTokenToTokenType: {[key: number]: Token} = {
  [ZephyrLexer.CONST]: 'const',
  [ZephyrLexer.LET]: 'let',
  [ZephyrLexer.SEMICOLON]: 'semicolon',
  [ZephyrLexer.ASSIGN]: 'assign',
  [ZephyrLexer.BLOCK_COMMENT]: 'blockComment',
  [ZephyrLexer.LINE_COMMENT]: 'lineComment',
  [ZephyrLexer.NUMBER]: 'number',
  [ZephyrLexer.STRING]: 'string',
  [ZephyrLexer.IDENTIFIER]: 'identifier',
};

export class LanguageServer {
  public getTokenStream(value: string) {
    const chars = CharStreams.fromString(value);
    const lexer = new ZephyrLexer(chars);
    const tokenStream = new CommonTokenStream(lexer);

    tokenStream.fill();

    return tokenStream.getTokens();
  }

  public getTokenTypeForIndex(tokenIndex: number): Token {
    if (tokenIndex in lexerTokenToTokenType) {
      return lexerTokenToTokenType[tokenIndex];
    }

    return 'unknown';
  }
}
