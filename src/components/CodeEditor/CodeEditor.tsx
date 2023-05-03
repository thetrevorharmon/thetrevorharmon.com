import React, {useCallback, useState, useMemo} from 'react';
import {Extension} from '@codemirror/state';
import ReactCodeEditor from '@uiw/react-codemirror';
import {zephyr} from './extensions';
import {javascript} from '@codemirror/lang-javascript';

import './CodeEditor.scss';
import {useTheme} from '../../context/ThemeContext';

interface Props {
  initialValue?: string;
  updateValue?: (value: string) => void;
  language?: 'zephyr' | 'javascript';
  extensions?: Extension[];
}

export function CodeEditor({
  initialValue,
  updateValue,
  language,
  extensions = [],
}: Props) {
  const theme = useTheme();
  const [value, setValue] = useState(initialValue ?? '');

  const handleOnChange = useCallback((value: string) => {
    setValue(value);
    if (updateValue) {
      updateValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memoizedExtensions = useMemo(() => {
    if (language === 'zephyr') {
      return [zephyr, ...extensions];
    }

    if (language === 'javascript') {
      return [javascript(), ...extensions];
    }

    return [...extensions];
  }, [language, extensions]);

  return (
    <div className="CodeEditor">
      <ReactCodeEditor
        value={value}
        theme={theme}
        extensions={memoizedExtensions}
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
