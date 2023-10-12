import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  StateField,
  StateEffect,
  Extension,
  Compartment,
} from '@codemirror/state';
import {syntaxTree} from '@codemirror/language';
import {linter, Diagnostic} from '@codemirror/lint';

import {EditorView, ViewUpdate} from '@codemirror/view';
import {Button} from '../../../../../components';
import ReactCodeEditor, {ReactCodeMirrorRef} from '@uiw/react-codemirror';
import {javascript} from '@codemirror/lang-javascript';
import {BASIC_SETUP, INITIAL_VALUE} from './constants';
import {useTheme} from '../../../../../context/ThemeContext';

const initialCount = 0;
const updateDeleteCountStateEffect = StateEffect.define<number>();

const deleteCountStateField = StateField.define<number>({
  create() {
    return initialCount;
  },
  update(currentValue, transaction) {
    let value = currentValue;

    if (transaction.isUserEvent('delete.backward')) {
      value = value + 1;
    }

    for (const effect of transaction.effects) {
      if (effect.is(updateDeleteCountStateEffect)) {
        value = effect.value;
      }
    }

    return value;
  },
});

function makeLinter(shouldLint: boolean) {
  return linter(
    (view) => {
      if (!shouldLint) {
        return [];
      }

      const diagnostics: Diagnostic[] = [];
      syntaxTree(view.state)
        .cursor()
        .iterate((node) => {
          if (node.name === 'RegExp')
            diagnostics.push({
              from: node.from,
              to: node.to,
              severity: 'warning',
              message: 'Regular expressions are FORBIDDEN 🙅‍♂️',
            });
        });

      return diagnostics;
    },
    {delay: 0},
  );
}

export function useExtensionWithDependency(
  view: EditorView | null,
  extensionFactory: () => Extension,
  deps: any[],
) {
  const compartment = useMemo(() => new Compartment(), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const extension = useMemo(() => compartment.of(extensionFactory()), []);

  useEffect(() => {
    if (view) {
      view.dispatch({
        effects: compartment.reconfigure(extensionFactory()),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return extension;
}

export function ReactCodeMirrorSyncStateExample() {
  const codeEditorRef = useRef<ReactCodeMirrorRef | null>(null);

  const [deleteCount, setDeleteCount] = useState<{
    count: number;
    updatedBy: 'react' | 'codemirror';
  }>({count: initialCount, updatedBy: 'codemirror'});
  const [shouldLint, setShouldLint] = useState<boolean>(true);

  useEffect(() => {
    if (codeEditorRef.current?.view) {
      codeEditorRef.current.view.dispatch({
        effects: [updateDeleteCountStateEffect.of(deleteCount.count)],
        sequential: true,
      });
    }
  }, [deleteCount]);

  const linter = useExtensionWithDependency(
    codeEditorRef.current?.view ?? null,
    () => makeLinter(shouldLint),
    [shouldLint],
  );

  const extensions = useMemo(() => {
    const syncDeleteCount = EditorView.updateListener.of(
      (viewUpdate: ViewUpdate) => {
        const count = viewUpdate.state.field(deleteCountStateField);
        setDeleteCount((currentState) => {
          if (count === currentState.count) {
            return currentState;
          }

          return {count, updatedBy: 'codemirror'};
        });
      },
    );

    return [deleteCountStateField, syncDeleteCount, linter, javascript()];
  }, [linter]);

  const theme = useTheme();

  function handleButtonClick() {
    setDeleteCount((currentState) => ({
      count: currentState.count + 1,
      updatedBy: 'react',
    }));
  }

  function handleLintButtonClick() {
    setShouldLint((shouldLint) => !shouldLint);
  }

  return (
    <div className="Breakout">
      <div className="grid grid-cols-[1fr,max(4.7rem),max(5.8rem)] sm:grid-cols-[1fr,auto,auto] gap-x-tiny mb-tiny items-center">
        <div className="sm:text-left">
          <span className="mr-tiny sm:mr-little">Count:</span>
          <span className="font-mono text-[0.85rem] font-bold">
            {deleteCount.count} / {deleteCount.updatedBy}
          </span>
        </div>
        <div className="text-center">
          <Button onClick={handleLintButtonClick} size="small">
            {shouldLint ? 'Stop linting' : 'Start linting'}
          </Button>
        </div>
        <div className="text-center">
          <Button onClick={handleButtonClick} size="small">
            Increase count
          </Button>
        </div>
      </div>
      <div className="CodeEditor">
        <ReactCodeEditor
          ref={codeEditorRef}
          value={INITIAL_VALUE}
          extensions={extensions}
          indentWithTab={false}
          basicSetup={BASIC_SETUP}
          theme={theme}
        />
      </div>
    </div>
  );
}
