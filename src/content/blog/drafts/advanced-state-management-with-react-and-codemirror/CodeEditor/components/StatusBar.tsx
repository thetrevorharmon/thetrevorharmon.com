import React from 'react';
import {Icon} from '../../../../../../components/Icon';
import {State} from '../CodeEditor';

export function StatusBar({state}: {state: State}) {
  const iconClassName = 'top-[2px] mr-little relative inline-block';

  switch (state) {
    case 'valid query':
      return (
        <>
          <Icon name="circle" size="small" className={`${iconClassName} `} />
          Waiting for input.
        </>
      );

    case 'query executed':
      return (
        <>
          <Icon
            name="play"
            size="small"
            className={`${iconClassName} text-sky-600`}
          />
          Query run in 1.8 seconds and queried 5429 rows.
        </>
      );

    case 'error':
      return (
        <>
          <Icon
            name="x"
            size="small"
            className={`${iconClassName} text-red-600`}
          />
          Wildcard selectors are disallowed.
        </>
      );

    case 'loading':
      return (
        <>
          <Icon
            name="loading"
            size="small"
            className={`${iconClassName} animate-spin`}
          />
          Performing query...
        </>
      );
  }
}
