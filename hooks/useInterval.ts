import * as React from 'react';


const useInterval = (
  callback: (...propsArr: any[]) => any,
  delay: number | null
) => {
  const savedCallback = React.useRef(null as any);

  React.useEffect(() => {
    savedCallback.current = callback;
  });

  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;