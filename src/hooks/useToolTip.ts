import React, { useEffect, useState } from 'react';

const useToolTip = (el: React.MutableRefObject<HTMLElement>) => {
  const [showTip, setShowTip] = useState(false);
  useEffect(() => {
    if (el) {
      const textLength = el.current.scrollWidth;
      const containLength = el.current.clientWidth;
      setShowTip(textLength > containLength)
    }
  }, [el])
  return showTip;
}

export default useToolTip;