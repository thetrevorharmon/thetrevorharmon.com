import classnames from 'classnames';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';

import {useTheme} from '../../../../context/ThemeContext';

interface FormContainerProps {
  children: React.ReactNode;
}

export const FormContainer = ({children}: FormContainerProps) => {
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  const theme = useTheme();

  const computeContainerHeight = () => {
    if (formContainerRef != null && formContainerRef.current != null) {
      setHeight(0); // this is to prevent old heights from returning a bad value
      setHeight(formContainerRef.current.offsetHeight);
    }
  };

  // Set height on intial load
  useLayoutEffect(() => {
    computeContainerHeight();
  }, []);

  // Add listener to recompute height on resize
  useEffect(() => {
    // This recomputes and sets the height on every resize.
    // Not ideal, but fine for now.
    window.addEventListener('resize', computeContainerHeight);
    return () => window.removeEventListener('resize', computeContainerHeight);
  }, []);

  const formContainerStyle =
    height !== 0
      ? {
          height: `${height}px`,
        }
      : {};

  return (
    <div
      className={classnames(
        'box-border',
        'py-medium desktop:py-large',
        'bg-caption-bg dark:bg-caption-bg-dark',
      )}
      ref={formContainerRef}
      style={formContainerStyle}
    >
      {children}
    </div>
  );
};
