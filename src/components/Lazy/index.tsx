import React, {Suspense} from 'react';

type LazyFunction<T extends React.ComponentType<any>> = () => Promise<{
  default: T;
}>;

function Lazy<T extends React.ComponentType<any>>(
  importFunc: LazyFunction<T>,
  fallback: React.ReactNode = <div>Loading...</div>,
): React.ComponentType<React.ComponentProps<T>> {
  const Component = React.lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}

export default Lazy;
