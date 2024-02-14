import {Language, LanguageSupport} from '@codemirror/language';
import {syntaxHighlight} from './highlight';
import {ParserAdapter} from './ParserAdapter';
import {Facet} from '@codemirror/state';

const parserAdapter = new ParserAdapter();
const zephyrLanguage = new Language(
  Facet.define(),
  parserAdapter,
  [],
  'Zephyr',
);

export const zephyr = new LanguageSupport(zephyrLanguage, [syntaxHighlight]);
