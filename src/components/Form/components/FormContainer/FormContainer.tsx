import classnames from 'classnames';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';

import {useTheme} from '../../../../context/ThemeContext';
import * as styles from './FormContainer.module.scss';

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

  const classname = classnames(
    styles.FormContainer,
    styles[`FormContainer-${theme}`],
  );

  return (
    <div
      className={classname}
      ref={formContainerRef}
      style={formContainerStyle}
    >
      {children}
    </div>
  );
};
