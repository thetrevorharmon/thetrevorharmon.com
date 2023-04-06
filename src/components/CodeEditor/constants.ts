// this is here because putting it inline causes prettier to format it
export const WELCOME_TO_ZEPHYR = `
/*
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

// That's it. Edit this code to try it out!
`;
