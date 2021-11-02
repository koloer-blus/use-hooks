import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

export default function useQueryParams<T extends any>(option: queryString.ParseOptions = {}) {
  const { search } = useLocation();
  const ret = queryString.parse(search, { arrayFormat: 'comma', ...option }) as unknown as T;
  const [state, setState] = useState<T>(ret);

  useEffect(() => {
    if (!_.isEqual(state, ret)) {
      setState(ret);
    }
  }, [search]);

  return state;
}
