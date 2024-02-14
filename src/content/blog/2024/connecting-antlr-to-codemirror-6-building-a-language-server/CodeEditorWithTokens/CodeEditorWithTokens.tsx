import React, {useMemo, useState} from 'react';
import {CodeEditor} from '../../../../../components/CodeEditor';
import {LanguageServer} from '../../../../../components/CodeEditor/extensions';

interface Props {
  initialValue?: string;
}

export function CodeEditorWithTokens({initialValue}: Props) {
  const [value, setValue] = useState(initialValue ?? '');

  const languageServer = useMemo(() => new LanguageServer(), []);
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
          className={`${cellClasses} bg-stone-50 dark:bg-[#2f2f2f] border-b border-[#ccc] dark:border-[#555]`}
        >
          {header}
        </th>
      ))}
    </tr>
  );

  const tableBodyMarkup = tokens.map((token) => {
    const values = Object.values(token);

    return (
      <tr className="even:bg-stone-100 even:dark:bg-[#202020]">
        {values.map((value) => (
          <td className={`${cellClasses}`}>{value}</td>
        ))}
      </tr>
    );
  });

  return (
    <div className="Breakout">
      <CodeEditor
        initialValue={value}
        updateValue={setValue}
        language="zephyr"
      />
      <div className="mt-normal bg-caption-bg dark:bg-caption-bg-dark rounded-md overflow-hidden border border-[#ddd] dark:border-[#555] text-[0.85rem] max-h-[300px] overflow-y-auto">
        <table className="w-full font-mono ">
          <thead>{tableHeaderMarkup}</thead>
          <tbody>{tableBodyMarkup}</tbody>
        </table>
      </div>
    </div>
  );
}
