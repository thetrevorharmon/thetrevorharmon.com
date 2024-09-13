import React, {useMemo} from 'react';

import {CodeEditor} from '../../../../../components/CodeEditor';
import {EditorState, Facet} from '@codemirror/state';
import {EditorView, ViewUpdate, showPanel} from '@codemirror/view';

const INITIAL_VALUE = `
// This editor has a tab size of 8, a bottom panel,
// and a focus logger. All of them are powered by facets.
const hello = () => {
\treturn 'world';
}
`;

const editorNameFacet = Facet.define<string>();

const panel = showPanel.of((view: EditorView) => {
  const dom = document.createElement('div');
  const editorName = view.state.facet(editorNameFacet);
  dom.textContent = `This editor is named: ${editorName}.`;

  return {dom};
});

const focusStateLogger = EditorView.updateListener.of(
  (viewUpdate: ViewUpdate) => {
    if (!viewUpdate.focusChanged) {
      return;
    }

    console.log(
      `The user ${
        viewUpdate.view.hasFocus ? 'is' : 'is not'
      } focusing on the editor`,
    );
  },
);

const tabSize = EditorState.tabSize.of(8);

export default function FacetExample() {
  const extensions = useMemo(
    () => [
      panel,
      focusStateLogger,
      tabSize,
      editorNameFacet.of('My Cool Editor'),
    ],
    [],
  );

  return (
    <div className="Breakout">
      <CodeEditor
        language="javascript"
        initialValue={INITIAL_VALUE}
        extensions={extensions}
      />
    </div>
  );
}
