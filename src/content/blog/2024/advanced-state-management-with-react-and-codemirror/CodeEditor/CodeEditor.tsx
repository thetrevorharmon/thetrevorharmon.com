import React, {useRef, useState} from 'react';
import {CodeEditor as GlobalCodeEditor} from '../../../../../components/CodeEditor';
import {
  linter,
  Diagnostic,
  setDiagnosticsEffect,
  diagnosticCount,
} from '@codemirror/lint';
import {EditorView, keymap} from '@codemirror/view';

import {Button} from '../../../../../components';
import {Annotation, EditorState, Facet} from '@codemirror/state';
import {ReactCodeMirrorRef} from '@uiw/react-codemirror';
import {StatusBar} from './components/StatusBar';

export type State = 'valid query' | 'query executed' | 'error' | 'loading';

const emitStateToReact = Facet.define<(state: State) => void>();

function emitState(state: State, editorState: EditorState) {
  const [emit] = editorState.facet(emitStateToReact);

  emit(state);
}

function checkQueryForWildcard(query: string): Diagnostic | null {
  const wildcardIndex = query.indexOf('*');

  if (wildcardIndex === -1) {
    return null;
  }

  return {
    from: wildcardIndex,
    to: wildcardIndex + 1,
    severity: 'error',
    message:
      'Wildcard selectors are disallowed. Please specify the columns you want to select.',
  };
}

const sqlLinter = linter(
  (view: EditorView) => {
    const document = view.state.doc.toString();

    const wildcardError = checkQueryForWildcard(document);

    if (wildcardError == null) {
      emitState('valid query', view.state);

      return [];
    }

    emitState('error', view.state);
    return [wildcardError];
  },
  {
    delay: 2500,
  },
);

const clearErrorOnDocChange = EditorState.transactionFilter.of(
  (transaction) => {
    if (transaction.docChanged && diagnosticCount(transaction.state) < 1) {
      emitState('valid query', transaction.state);
    }

    return transaction;
  },
);

const triggerEvent = Annotation.define<'click' | 'keyboard'>();

const keyboardShortcuts = keymap.of([
  {
    key: 'Ctrl-Enter',
    run: (view: EditorView) => {
      if (diagnosticCount(view.state) > 0) {
        return true;
      }

      view.dispatch({annotations: triggerEvent.of('keyboard')});

      return true;
    },
  },
]);

const stateCoordinator = EditorState.transactionFilter.of((transaction) => {
  const eventTrigger = transaction.annotation(triggerEvent);

  if (eventTrigger == null) {
    return transaction;
  }

  const document = transaction.state.doc.toString();
  const diagnostic = checkQueryForWildcard(document);

  if (diagnostic == null) {
    emitState('loading', transaction.state);

    return transaction;
  }

  emitState('error', transaction.state);

  return [
    transaction,
    {
      effects: [setDiagnosticsEffect.of([diagnostic])],
    },
  ];
});

export function CodeEditor() {
  const initialValue = `\nSELECT *\nFROM customers\nWHERE customer_id in (100,11,33)\n`;
  const [state, setState] = useState<State>('valid query');

  const codeEditorRef = useRef<ReactCodeMirrorRef>(null);

  function handleButtonClick() {
    codeEditorRef.current?.view?.dispatch({
      annotations: triggerEvent.of('click'),
    });
  }

  const emitStateToReactExtension = emitStateToReact.of((value) => {
    if (value !== 'loading') {
      setState(value);

      return;
    }

    setState('loading');

    setTimeout(() => {
      setState('query executed');
    }, 1500);
  });

  return (
    <div className="">
      <div className="bg-stone-500 dark:bg-caption-bg-dark py-normal md:py-medium BreakoutWithPadding rounded-md">
        <div className="font-mono flex justify-between items-center">
          <span className="uppercase tracking-widest text-xs font-bold text-stone-50">
            SQL Terminal 3000
          </span>
          <Button
            size="small"
            onClick={handleButtonClick}
            className="mb-little text-xs font-mono"
            disabled={state === 'error'}
          >
            run
          </Button>
        </div>
        <GlobalCodeEditor
          ref={codeEditorRef}
          initialValue={initialValue}
          language="sql"
          extensions={[
            sqlLinter,
            keyboardShortcuts,
            stateCoordinator,
            emitStateToReactExtension,
            clearErrorOnDocChange,
          ]}
          hasFooter
        />
        <div className="bg-[#ddd] dark:bg-[#555] px-small py-tiny rounded-b-md font-mono text-xs">
          <StatusBar state={state} />
        </div>
      </div>
    </div>
  );
}
