import {HighlightStyle, syntaxHighlighting} from '@codemirror/language';

import {tags} from '@lezer/highlight';

const zephyrColoring = HighlightStyle.define([
  {
    tag: tags.comment,
    class: 'text-text-muted dark:text-text-muted-dark italic',
  },
  {tag: tags.keyword, class: 'text-[#a4599d] dark:text-[#beaaf9]'},
  {tag: tags.variableName, class: 'text-[#32888d] dark:text-[#70cde3]'},
  {tag: tags.string, class: 'text-[#679d5c] dark:text-[#c1e38a]'},
  {tag: tags.operator, class: 'text-[#363636] dark:text-[#b1b1b1]'},
  {tag: tags.number, class: 'text-[#bb5131] dark:text-[#fcd58b]'},
]);

export const zephyrSyntaxHighlight = syntaxHighlighting(zephyrColoring);
