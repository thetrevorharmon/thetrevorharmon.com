import React, {useCallback, useState, useMemo, forwardRef} from 'react';
import {Extension} from '@codemirror/state';
import ReactCodeEditor, {ReactCodeMirrorRef} from '@uiw/react-codemirror';
import {zephyr} from './extensions';
import {javascript} from '@codemirror/lang-javascript';

import './CodeEditor.scss';
import {useTheme} from '../../context/ThemeContext';
import {sql} from '@codemirror/lang-sql';
import classNames from 'classnames';

interface Props {
  initialValue?: string;
  updateValue?: (value: string) => void;
  language?: 'zephyr' | 'javascript' | 'sql';
  extensions?: Extension[];
  hasFooter?: boolean;
}

const CodeEditor = forwardRef<ReactCodeMirrorRef, Props>((props, ref) => {
  const {
    initialValue,
    updateValue,
    language,
    extensions = [],
    hasFooter = false,
  } = props;

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
    switch (language) {
      case 'zephyr':
        return [zephyr, ...extensions];

      case 'javascript':
        return [javascript(), ...extensions];

      case 'sql':
        return [sql(), ...extensions];

      default:
        return [...extensions];
    }
  }, [language, extensions]);

  return (
    <div className={classNames('CodeEditor', hasFooter && 'HasFooter')}>
      <ReactCodeEditor
        ref={ref}
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
});

export default CodeEditor;
