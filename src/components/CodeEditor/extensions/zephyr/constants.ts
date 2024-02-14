import {NodeSet, NodeType} from '@lezer/common';
import {styleTags, tags} from '@lezer/highlight';
import {Token} from './language';
import {defineLanguageFacet, languageDataProp} from '@codemirror/language';

export const tokenToNodeType: {[key in Token | 'document']: NodeType} = {
  document: NodeType.define({
    id: 0,
    name: 'document',
    top: true,
    props: [
      [
        languageDataProp,
        defineLanguageFacet({
          commentTokens: {block: {open: '/*', close: '*/'}, line: '//'},
          closeBrackets: {brackets: ["'"]},
        }),
      ],
    ],
  }),
  const: NodeType.define({id: 1, name: 'const'}),
  let: NodeType.define({id: 2, name: 'let'}),
  semicolon: NodeType.define({id: 3, name: 'semicolon'}),
  assign: NodeType.define({id: 4, name: 'assign'}),
  number: NodeType.define({id: 5, name: 'number'}),
  string: NodeType.define({id: 6, name: 'string'}),
  identifier: NodeType.define({id: 7, name: 'identifier'}),
  unknown: NodeType.define({id: 8, name: 'unknown'}),
  blockComment: NodeType.define({id: 9, name: 'blockComment'}),
  lineComment: NodeType.define({id: 10, name: 'lineComment'}),
};

export const parserAdapterNodeSet = new NodeSet(
  Object.values(tokenToNodeType),
).extend(
  styleTags({
    const: tags.keyword,
    let: tags.keyword,
    assign: tags.operator,
    number: tags.number,
    string: tags.string,
    identifier: tags.variableName,
    blockComment: tags.comment,
    lineComment: tags.comment,
  }),
);
