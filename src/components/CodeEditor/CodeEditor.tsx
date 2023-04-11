import React, {useCallback, useState} from 'react';
import ReactCodeEditor from '@uiw/react-codemirror';
import {zephyr} from './extensions';

import './CodeEditor.scss';

interface Props {
  initialValue?: string;
  updateValue?: (value: string) => void;
}

export function CodeEditor({initialValue, updateValue}: Props) {
  const [value, setValue] = useState(initialValue ?? '');

  const handleOnChange = useCallback((value: string) => {
    setValue(value);
    if (updateValue) {
      updateValue(value);
    }
  }, []);

  return (
    <div className="Breakout my-medium CodeEditor">
      <ReactCodeEditor
        value={value}
        extensions={[zephyr]}
        onChange={handleOnChange}
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
    </div>
  );
}
