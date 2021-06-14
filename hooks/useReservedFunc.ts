import * as React from 'react';

export type noop = (...args: any[]) => any;

const usePersistFn = function <T extends noop>(fn: T) {
  const fnRef = React.useRef<T>(fn);
  fnRef.current = fn;

  const persistFn = React.useRef<T>();
  if (!persistFn.current) {
    persistFn.current = function (...args) {
      //@ts-ignore
      return fnRef.current.apply(this, args);
    } as T;
  }

  return persistFn.current;
}

export default usePersistFn;