import React from 'react';
import {TableOfContents} from '../../../../components';

interface Props {
  entryIndex: number;
}

export function ConnectingAntlrToCodeMirrorTableOfContents({
  entryIndex,
}: Props) {
  const header =
    'This article is part of my "Connecting ANTLR to CodeMirror 6" series:';

  const articles = [
    {
      name: 'An Introduction',
      url: 'connecting-antlr-to-codemirror-6-an-introduction',
    },
    {
      name: 'Building a Language Server',
      url: 'connecting-antlr-to-codemirror-6-building-a-language-server',
    },
    {
      name: 'Connecting ANTLR and CodeMirror',
      url: 'connecting-antlr-to-codemirror-6-getting-antlr-and-codemirror-talking',
    },
  ];

  if (entryIndex >= articles.length) {
    throw new Error('Entry index is out of bounds for table of contents');
  }

  const entries = articles.map((article, index) => ({
    ...article,
    isCurrentEntry: index === entryIndex,
  }));

  const footer =
    entryIndex === 0
      ? ''
      : 'I would recommend starting with the first article to learn about CodeMirror, ANTLR, and Zephyr.';

  return <TableOfContents header={header} entries={entries} footer={footer} />;
}
