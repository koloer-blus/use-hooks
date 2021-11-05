import * as React from 'react';
import { isFunction } from './util';

const useMergeState = <T extends object>(
  initialState: T = {} as T,
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void] => {
  const [state, setState] = React.useState(initialState);
  const setMergeState = React.useCallback((patch) => {
    setState((prevState) => ({ ...prevState, ...(isFunction(patch) ? patch(prevState) : patch) }));
  }, []);
  return [state, setMergeState];
};

export default useMergeState;