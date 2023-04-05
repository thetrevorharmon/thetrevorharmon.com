import React, {useState} from 'react';
import ReactCodeEditor from '@uiw/react-codemirror';
import {zephyr} from './extensions';

import './CodeEditor.scss';
import {Breakout} from '../../UI-Kit';

interface Props {
  initialValue?: string;
}

export function CodeEditor({initialValue}: Props) {
  const [value, setValue] = useState(initialValue ?? '');

  return (
    <Breakout className="my-medium CodeEditor">
      <ReactCodeEditor
        value={value}
        extensions={[zephyr]}
        onChange={setValue}
        indentWithTab={false}
        basicSetup={{
          foldGutter: false,
          lineNumbers: true,
          highlightActiveLineGutter: true,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: false,
          bracketMatching: false,
          closeBrackets: false,
          autocompletion: false,
          rectangularSelection: false,
          crosshairCursor: false,
          highlightActiveLine: true,
          highlightSelectionMatches: false,
          closeBracketsKeymap: false,
          searchKeymap: false,
          foldKeymap: false,
          completionKeymap: false,
          lintKeymap: false,
        }}
      />
    </Breakout>
  );
}
