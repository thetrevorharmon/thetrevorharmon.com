import React, {useEffect, useState} from 'react';
import {Button} from '../../../../../components';
import classNames from 'classnames';

export function ButtonExample() {
  const [count, setCount] = useState(1);

  function handleClick() {
    setCount((count) => {
      if (count >= 10) {
        return 0;
      }

      return ++count;
    });
  }

  useEffect(() => {
    if (count === 0) {
      alert(`Count was reset to 0`);
    }
  }, [count]);

  return (
    <div
      className={classNames(
        'BreakoutWithPadding',
        'bg-caption-bg dark:bg-caption-bg-dark',
        'my-medium py-medium',
        'border border-caption-border dark:border-caption-border-dark',
        'rounded-md',
      )}
    >
      <div className="flex flex-col sm:flex-row justify-center">
        <Button onClick={handleClick}>Increase Counter</Button>
        <p className="text-center !mb-0 sm:!my-auto sm:ml-normal">
          Count: <span className="font-mono">{count}</span>
        </p>
      </div>
    </div>
  );
}
