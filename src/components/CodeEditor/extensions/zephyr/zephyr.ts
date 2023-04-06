import {
  Language,
  LanguageSupport,
  defineLanguageFacet,
} from "@codemirror/language";
import { syntaxHighlight } from "./highlight";
import { ParserAdapter } from "./ParserAdapter";

const parserAdapter = new ParserAdapter();
const facet = defineLanguageFacet({
  commentTokens: { block: { open: "/*", close: "*/" } },
});

const zephyrLanguage = new Language(facet, parserAdapter, [], "Zephyr");

export const zephyr = new LanguageSupport(zephyrLanguage, [syntaxHighlight]);
