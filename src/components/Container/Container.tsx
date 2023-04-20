import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({children}: ContainerProps) => {
  return <div className="px-normal max-w-container mx-auto">{children}</div>;
};
