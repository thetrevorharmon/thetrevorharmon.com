import React, {useMemo} from 'react';
import {EditorView, ViewPlugin, ViewUpdate} from '@codemirror/view';

import {CodeEditor} from '../../../../../components/CodeEditor';

const INITIAL_VALUE = `
// This editor displays the midpoint of the editor.
// If you place your focus on the editor, you'll see it
// appear in the bottom right corner. If you remove your
// focus, it will disappear.
`;

const midpointViewPlugin = ViewPlugin.fromClass(
  class {
    widget: HTMLElement;

    constructor(view: EditorView) {
      const div = document.createElement('div');
      this.widget = view.dom.appendChild(div);

      this.widget.className =
        'bg-green-500 text-black px-[3px] mx-[3px] rounded-sm absolute bottom-[4px] right-[2px]';

      if (!view.hasFocus) {
        this.widget.classList.add('hidden');
      }

      const midpoint = Math.floor(view.state.doc.length / 2);

      this.widget.textContent = `${midpoint}`;
    }

    update(update: ViewUpdate) {
      if (update.docChanged) {
        this.widget.textContent = `${Math.floor(update.state.doc.length / 2)}`;
      }

      if (!update.focusChanged) {
        return;
      }

      if (update.view.hasFocus) {
        this.widget.classList.remove('hidden');
      } else {
        this.widget.classList.add('hidden');
      }
    }

    destroy() {
      this.widget.remove();
    }
  },
);

export function ViewPluginExample() {
  const extensions = useMemo(() => [midpointViewPlugin], []);

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
