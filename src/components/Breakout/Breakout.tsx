import React from 'react';

interface Props {
  children: React.ReactNode;
}

export function Breakout({children}: Props) {
  return <div className="Breakout">{children}</div>;
}
