import { useState, useEffect } from 'react';
import queryString from 'query-string';
import * as _ from 'lodash';

export default function useQueryParams<T extends any>(option: queryString.ParseOptions = {}) {
  const { search } = window.location;
  const ret = queryString.parse(search, { arrayFormat: 'comma', ...option }) as unknown as T;
  const [state, setState] = useState<T>(ret);

  useEffect(() => {
    if (!_.isEqual(state, ret)) {
      setState(ret);
    }
  }, [search]);

  return state;
}
