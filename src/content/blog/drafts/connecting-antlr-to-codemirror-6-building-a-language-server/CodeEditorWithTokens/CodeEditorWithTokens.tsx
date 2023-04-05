import React, {useMemo, useState} from 'react';
import {CodeEditor} from '../../../../../components/CodeEditor';
import {Zephyr} from '../../../../../components/CodeEditor/language';

interface Props {
  initialValue?: string;
}

export function CodeEditorWithTokens({initialValue}: Props) {
  const [value, setValue] = useState(initialValue ?? '');

  const languageServer = useMemo(() => new Zephyr(), []);
  const tokens = languageServer.getTokenStream(value).map((token) => ({
    index: token.tokenIndex,
    range: [token.startIndex, token.stopIndex],
    type: languageServer.getTokenTypeForIndex(token.type),
  }));

  console.log(tokens);

  return <CodeEditor initialValue={value} updateValue={setValue} />;
}
