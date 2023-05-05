import React, {useMemo} from 'react';

import {CodeEditor} from '../../../../../components/CodeEditor';
import {StateField} from '@codemirror/state';
import {PanelConstructor, showPanel} from '@codemirror/view';

const INITIAL_VALUE = `

// Try editing this content and see the counter change!
const hello = 'world';

`;

function createCounterPanel(value: number): PanelConstructor {
  return () => {
    const dom = document.createElement('div');
    dom.textContent = `Current count is ${value}`;

    return {dom};
  };
}

const changeCounterStateField = StateField.define<number>({
  create: () => {
    return 0;
  },
  update: (currentValue, transaction) => {
    let newValue = currentValue;

    if (transaction.docChanged) {
      newValue += 1;
    }

    return newValue;
  },
  provide: (value) => showPanel.from(value, createCounterPanel),
});

export function StateFieldExample() {
  const extensions = useMemo(() => [changeCounterStateField], []);

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
