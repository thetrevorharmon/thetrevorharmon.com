/* eslint-disable no-useless-escape */
export const INITIAL_VALUE = `// This is a little javascript editor.
// Try deleting some of the text with backspace–
// You should see the counter increase!

const syncingState = 'very cool';
const forbiddenRegex = /^\d+(\.\d*)?$/;`;

export const BASIC_SETUP = {
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
};
