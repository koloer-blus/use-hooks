import {useState, useEffect} from 'react'

/**
 * 预加载图片
 * @param src: 图片的路径;
 */
const usePreLoadImg = (src: string) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasStartedInitialFetch, setHasStartedInitialFetch] = useState(false);

  useEffect(() => {
    setHasStartedInitialFetch(true);
    setHasLoaded(false);
    setHasError(false);

    const img = new Image();
    img.src = src;
    const handleError = () => {
      setHasError(true);
    }
    const handleLoad = () => {
      setHasLoaded(true);
      setHasError(false);
    }
    img.onerror =handleError;
    img.onload = handleLoad;
    return () => {
      img.removeEventListener('error', handleError);
      img.removeEventListener('load', handleLoad)
    }
  }, [src]);

  return {
    hasLoaded, hasError, hasStartedInitialFetch
  }
}

export default usePreLoadImg;