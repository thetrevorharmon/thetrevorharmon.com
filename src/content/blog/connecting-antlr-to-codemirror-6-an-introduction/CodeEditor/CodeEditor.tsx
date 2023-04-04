import React, {useState} from 'react';
import ReactCodeEditor from '@uiw/react-codemirror';
import {zephyr} from './extensions';
import {EditorView} from '@codemirror/view';
import {Breakout} from '../../../../UI-Kit';

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

  const theme = EditorView.theme({
    // '&': {
    //   border: `1px solid ${tailwindConfig.theme.colors.slate['500']}`,
    //   borderRadius: tailwindConfig.theme.borderRadius.md,
    //   overflow: 'hidden',
    // },
    // '&.cm-focused': {
    //   outline: 'none',
    //   borderColor: tailwindConfig.theme.colors.slate['900'],
    // },
    // '.cm-scroller': {
    //   fontFamily: tailwindConfig.theme.fontFamily.mono.join(', '),
    //   fontSize: tailwindConfig.theme.fontSize.sm[0],
    // },
    // '.cm-gutter.cm-lineNumbers': {},
    // '.cm-gutters': {
    //   color: tailwindConfig.theme.colors.slate['500'],
    //   borderColor: tailwindConfig.theme.colors.slate['500'],
    //   backgroundColor: tailwindConfig.theme.colors.slate['200'],
    // },
    // '.cm-activeLine': {
    //   backgroundColor: tailwindConfig.theme.colors.slate['100'],
    // },
    // '.cm-lineNumbers .cm-gutterElement': {
    //   padding: `0 ${tailwindConfig.theme.margin['2']} 0 ${tailwindConfig.theme.margin['2']}`,
    // },
    // '.cm-activeLineGutter': {
    //   backgroundColor: 'transparent',
    // },
    // '.cm-gutterElement.cm-activeLineGutter': {
    //   color: tailwindConfig.theme.colors.blue['900'],
    //   fontWeight: '800',
    // },
  });

  return (
    <Breakout className="my-medium">
      <ReactCodeEditor
        value={value}
        extensions={[zephyr, theme]}
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
