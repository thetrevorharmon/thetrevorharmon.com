import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({children}: ContainerProps) => {
  return (
    <div className="px-container-base min-[590px]:px-0 max-w-container mx-auto">
      {children}
    </div>
  );
};
