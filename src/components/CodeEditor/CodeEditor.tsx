import React, {type CSSProperties, useCallback, useState, useMemo, forwardRef} from 'react';
import {type Extension} from '@codemirror/state';
import {EditorView} from '@codemirror/view';
import ReactCodeEditor, {type ReactCodeMirrorRef} from '@uiw/react-codemirror';
import {zephyr} from './extensions';
import {javascript} from '@codemirror/lang-javascript';

import './CodeEditor.scss';
import {useTheme} from '../../lib/theme';
import {sql} from '@codemirror/lang-sql';
import classNames from 'classnames';
import {lineCount} from './lineCount';

interface Props {
  initialValue?: string;
  updateValue?: (value: string) => void;
  language?: 'zephyr' | 'javascript' | 'sql';
  extensions?: Extension[];
  hasFooter?: boolean;
  /** CSS length the mounted editor adds beyond its lines (a panel, a tall widget). Reserved before mount so hydration doesn't shift the page. */
  extraHeight?: string;
  onCreateEditor?: (view: EditorView) => void;
}

export const CodeEditor = forwardRef<ReactCodeMirrorRef, Props>(
  (props, ref) => {
    const {
      initialValue,
      updateValue,
      language,
      extensions = [],
      hasFooter = false,
      extraHeight = '0px',
      onCreateEditor,
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
      <div
        className={classNames('CodeEditor', hasFooter && 'HasFooter')}
        style={
          {
            '--cm-lines': lineCount(initialValue),
            '--cm-extra': extraHeight,
          } as CSSProperties
        }
      >
        <ReactCodeEditor
          ref={ref}
          onCreateEditor={onCreateEditor}
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
  },
);

CodeEditor.displayName = 'CodeEditor';
