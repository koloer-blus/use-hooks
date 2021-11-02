import { useState } from 'react';

const useForceUpdate = () => {
  const [, setFlag] = useState<number>(0);

  return () => setFlag(v => v + 1);
};

export default useForceUpdate;
