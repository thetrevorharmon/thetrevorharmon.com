import React from 'react';
import classnames from 'classnames';

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export const Container = ({children, className}: ContainerProps) => {
  return (
    <div className={classnames('px-normal max-w-container mx-auto', className)}>
      {children}
    </div>
  );
};
