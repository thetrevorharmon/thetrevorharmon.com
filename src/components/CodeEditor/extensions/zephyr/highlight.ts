import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";

import { tags } from "@lezer/highlight";

export const syntaxHighlight = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.comment, class: "text-slate-500" },
    { tag: tags.keyword, class: "text-fuchsia-700" },
    { tag: tags.variableName, class: "text-blue-600" },
    { tag: tags.string, class: "text-lime-600" },
    { tag: tags.number, class: "text-violet-700" },
    { tag: tags.operator, class: "text-orange-700" },
  ])
);
