import { useLayoutEffect } from 'react';
import useForceUpdate from './useForceUpdate';

const useElementHeight = (selector: string) => {
  const forceUpdate = useForceUpdate();

  const element = document.querySelector(selector);

  useLayoutEffect(() => {
    if (element) {
      const observer = new MutationObserver(() => forceUpdate());
      observer.observe(element, { childList: true });
      return () => observer.disconnect();
    }
  }, []);

  if (!element) return 0;

  return element.clientHeight;
};

export default useElementHeight;
