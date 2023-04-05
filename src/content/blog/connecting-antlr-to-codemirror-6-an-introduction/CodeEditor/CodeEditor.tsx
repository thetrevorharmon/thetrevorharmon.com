import React, {useState} from 'react';
import ReactCodeEditor from '@uiw/react-codemirror';
import {zephyr} from './extensions';
import {EditorView} from '@codemirror/view';
import {Breakout} from '../../../../UI-Kit';

import './CodeEditor.scss';
import { useTheme } from '../../../../context/ThemeContext';

const INITIAL_CODE = `/*
  Welcome to Zephyr!

  This is a little toy language to show how to connect
  an ANTLR language server to CodeMirror 6.

  • It supports variable assignment & comments.
  • Semicolons are required at the end of statements.
  • Only numbers and strings can be assigned to variables.

  Here's a block comment!
*/
// It also supports line comments, if you prefer those.

// You can do variable assignments with \`const\`:
const myFirstVariable = 1000;

// And \`let\` works for variable assignments, too:
let anotherVariable = 'This is another variable!';

// That's it. Edit this code to try it out!`;

export function CodeEditor() {
  const [value, setValue] = useState(INITIAL_CODE);
  const isDarkMode = useTheme() === 'Dark';

  return (
    <Breakout className="my-medium CodeEditor">
      <ReactCodeEditor
        value={value}
        extensions={[zephyr]}
        onChange={setValue}
        theme={isDarkMode ? 'dark' : 'light'}
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
