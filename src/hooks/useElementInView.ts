import { useRef, useEffect } from 'react';

type IOptions = {
  threshold?: number[];
  effectDeps?: any[];
}
/**
 * 判断当前元素进入视口后执行的函数
 * @param elementIds
 * @param callback
 * @param options
 */
const useElementInView = (
  elementIds: string[] | HTMLElement[],
  callback: (entry: IntersectionObserverEntry) => void,
  options: IOptions) => {
  const { threshold = [0, 0.5], effectDeps = [] } = options;
  const io = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    io.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { intersectionRatio } = entry;
        if (!intersectionRatio) return;
        callback(entry);
      });
    }, {
      threshold,
    });
    elementIds.forEach((elId: any) => {
      // 支持传入的domRef
      const element = typeof elId === 'string' ? document.getElementById(elId) : elId;
      if (element && element instanceof Element) {
        io.current && io.current.observe(element);
      } else {
        return new Error(`Can't find element id is ${elId}`);
      }
    });
    return () => {
      io.current && io.current.disconnect();
      io.current = null;
    };
  }, [...effectDeps]);
};

export default useElementInView;