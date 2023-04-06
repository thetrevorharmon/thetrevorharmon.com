import React, {useMemo, useState} from 'react';
import {CodeEditor} from '../../../../../components/CodeEditor';
import {Zephyr} from '../../../../../components/CodeEditor/language';
import {Breakout} from '../../../../../UI-Kit';

interface Props {
  initialValue?: string;
}

export function CodeEditorWithTokens({initialValue}: Props) {
  const [value, setValue] = useState(initialValue ?? '');

  const languageServer = useMemo(() => new Zephyr(), []);
  const tokens = languageServer.getTokenStream(value).map((token) => ({
    text:
      token.type === -1
        ? '<EOF>'
        : value.slice(token.startIndex, token.stopIndex + 1),
    type: languageServer.getTokenTypeForIndex(token.type),
    index: token.tokenIndex,
    range: `[${token.startIndex}, ${token.stopIndex}]`,
  }));

  const cellClasses = 'text-left px-small py-tiny';

  const headers = Object.keys(tokens[0]);
  const tableHeaderMarkup = (
    <tr>
      {headers.map((header) => (
        <th
          className={`${cellClasses} bg-[#dedede] dark:bg-[#2f2f2f] border-b border-[#ddd] dark:border-[#555]`}
        >
          {header}
        </th>
      ))}
    </tr>
  );

  const tableBodyMarkup = tokens.map((token) => {
    const values = Object.values(token);

    return (
      <tr className="even:bg-[#e2e2e2] even:dark:bg-[#202020]">
        {values.map((value) => (
          <td className={`${cellClasses}`}>{value}</td>
        ))}
      </tr>
    );
  });

  return (
    <>
      <CodeEditor initialValue={value} updateValue={setValue} />
      <Breakout className="bg-caption-bg dark:bg-caption-bg-dark rounded-md overflow-hidden border border-[#ddd] dark:border-[#555] text-[0.95rem] max-h-[300px] overflow-y-auto">
        <table className="w-full font-mono ">
          <thead>{tableHeaderMarkup}</thead>
          <tbody>{tableBodyMarkup}</tbody>
        </table>
      </Breakout>
    </>
  );
}
