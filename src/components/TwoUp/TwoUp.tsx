import React from 'react';

interface Props {
  children: React.ReactNode;
}

export function TwoUp({children}: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-small TwoUp my-medium">
      {children}
    </div>
  );
}
