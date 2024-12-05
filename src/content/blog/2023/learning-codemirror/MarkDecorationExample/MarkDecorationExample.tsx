import React, {useMemo} from 'react';
import {EditorState, StateField} from '@codemirror/state';
import {
  EditorView,
  Decoration,
  DecorationSet,
  WidgetType,
} from '@codemirror/view';

import {CodeEditor} from '../../../../../components/CodeEditor';

const INITIAL_VALUE = `

// This editor displays the midpoint of the editor.    
// If you add text before or  after the midpoint, you'll see
// that it moves around and updates the value. Try it!

`;

class MidpointWidget extends WidgetType {
  toDOM(view: EditorView) {
    const midpoint = Math.floor(view.state.doc.length / 2);

    const dom = document.createElement('span');
    dom.textContent = `${midpoint}`;
    dom.className = 'bg-green-500 text-black px-[3px] mx-[3px] rounded-sm';

    return dom;
  }
}

function getMidpointWidgetDecorationSet(midpoint: number) {
  const widget = new MidpointWidget();

  return Decoration.set([
    Decoration.widget({
      widget,
    }).range(midpoint),
  ]);
}

const midpointWidgetStateField = StateField.define<DecorationSet>({
  create(state: EditorState) {
    const midpoint = Math.floor(state.doc.length / 2);

    return getMidpointWidgetDecorationSet(midpoint);
  },
  update(currentDecorations, transaction) {
    if (transaction.docChanged) {
      const midpoint = Math.floor(transaction.newDoc.length / 2);

      return getMidpointWidgetDecorationSet(midpoint);
    }

    return currentDecorations;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export default function MarkDecorationExample() {
  const extensions = useMemo(() => [midpointWidgetStateField], []);

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
