# Language files

These files are generated with the `yarn make` command. I decided to commit them to the repo, but **do not manually edit them**. Instead, use the node command to generate them if you make a change to the grammar.

## Hand edit to redo after regenerating

The project uses `verbatimModuleSyntax`, so type-only imports must be marked `import type`. The generator does not do this. After regenerating, change these imports by hand:

- `ZephyrLexer.ts`: `CharStream`, `Vocabulary`
- `ZephyrParser.ts`, `ZephyrParserListener.ts`, `ZephyrParserVisitor.ts`: every import that is only used as a type

Then run `npx tsc --noEmit` and `yarn build`. Both fail if one is missed. See `git log -p` on this directory for the exact lines.
