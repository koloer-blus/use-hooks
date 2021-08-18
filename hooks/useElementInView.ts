import * as React from 'react';

type IOptions = {
  threshold?: number[];
  effectDeps?: any[];
}

const useElementInView = (
  elementIds: string[],
  callback: (entry: IntersectionObserverEntry) => void,
  options: IOptions) => {
  const { threshold = [0, 0.5], effectDeps = [] } = options;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const { intersectionRatio } = entry;
      if (!intersectionRatio) return;
      callback(entry);
    });
  }, {
    threshold,
  });
  const addObserve = () => {
    elementIds.forEach((elId) => {
      const element = document.getElementById(elId);
      if (element) {
        io.observe(element);
      } else {
        return new Error(`Can't find element id is ${elId}`);
      }
    });
  };
  const clear = () => {
    io.disconnect();
  };
  const unObserve = (elementIds: string[]) => {
    elementIds.forEach((elId) => {
      const element = document.getElementById(elId);
      if (element) {
        io.observe(element);
      }
    });
  };
  React.useEffect(() => {
    addObserve();
    return clear;
  }, [...effectDeps]);
  return unObserve;
};

export default useElementInView;