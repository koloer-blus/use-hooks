# use-hooks

---

## 1.useInterval

interval（定时触发的hooks）

```TypeScript
import React, { ReactEventHandler, useState } from 'react'
import './App.css'
import hooks from '../hooks'

function App() {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [isRunning, setIsRunning] = useState(true);

  hooks.useInterval(() => {
    setCount(count + 1);
  }, isRunning ? delay : null);

  return (
    <div
      style={{
        padding: 14
      }}
    >
      <div>{count}</div>
      <div>
        <input type="text" value={delay} onChange={(e: React.ChangeEvent) => setDelay(e.target.value || 1000)} />
      </div>
      <div>
        <button onClick={() => setIsRunning(!isRunning)}>暂停</button>
      </div>
    </div>
  );
}

export default App;


```

## 2.useMergeState

处理对象类型的state


```TypeScript
import React, { ReactEventHandler, useState } from 'react'
import './App.css'
import hooks from '../hooks'

function App() {
  const [state, setState] = hooks.useMergeState({
    hello: '',
    count: 0,
  });

  return (
    <div>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <p>
        <button type="button" onClick={() => setState({ hello: 'world' })}>
          set hello
        </button>
        <button type="button" onClick={() => setState({ foo: 'bar' })} style={{ margin: '0 8px' }}>
          set foo
        </button>
        <button type="button" onClick={() => setState((prev) => ({ count: prev.count + 1 }))}>
          count + 1
        </button>
      </p>
    </div>
  );
}

export default App;

```

## 3.useReservedFunc

保留函数引用的hook

```TypeScript
import React, { useState, useCallback, useRef } from 'react';
import { message } from 'antd';
import hooks from '../hooks'

export default () => {
  const [count, setCount] = useState(0);

  const showCountPersistFn = hooks.useReservedFunc(() => {
    message.info(`Current count is ${count}`);
  });

  const showCountCommon = useCallback(() => {
    message.info(`Current count is ${count}`);
  }, [count]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setCount((c) => c + 1);
        }}
      >
        Add Count
      </button>
      <p>You can click the button to see the number of sub-component renderings</p>

      <div style={{ marginTop: 32 }}>
        <h4>Component with persist function:</h4>
        {/* use persist function, ExpensiveTree component will only render once */}
        <ExpensiveTree showCount={showCountPersistFn} />
      </div>
      <div style={{ marginTop: 32 }}>
        <h4>Component without persist function:</h4>
        {/* without persist function, ExpensiveTree component will re-render on state change */}
        <ExpensiveTree showCount={showCountCommon} />
      </div>
    </>
  );
};
```

## 4. useElementInView

判断当前组件是否进入视口

```TS
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
  elementIds: string[],
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
    elementIds.forEach((elId) => {
      const element = document.getElementById(elId);
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
```

## 5.useQueryParams

获取url参数

```TS
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
```

## 6.useForceUpdate

强制更新

```TS
import { useState } from 'react';

const useForceUpdate = () => {
  const [, setFlag] = useState<number>(0);

  return () => setFlag(v => v + 1);
};

export default useForceUpdate;
```

## 7.useElementHeight

获取元素高度

```TS
import { useLayoutEffect } from 'react';
import useForceUpdate from './use-force-update';

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
```

## 8.useComputedState

获取实时更新的state

```TS
import { ComponentState, PropsWithoutRef, useState, useEffect } from 'react';

type Dependency<T> = PropsWithoutRef<T> | ComponentState;

export default function useComputedState<T>(computed: () => any, deps: Dependency<T>[]) {
  const [state, setState] = useState(computed());
  useEffect(() => {
    const newState = computed();
    setState(newState);
  }, [deps]);
  return state;
}

```

## 9.useMergeValue

获取合并的value和setValue函数

```TS
import React, { useState, useEffect, useRef } from 'react';
import { isUndefined } from './util';

export default function useMergeValue<T>(
  defaultStateValue: T,
  props?: {
    defaultValue?: T;
    value?: T;
  }
): [T, React.Dispatch<React.SetStateAction<T>>, T] {
  const { defaultValue, value } = props || {};
  const firstRenderRef = useRef(true);

  const [stateValue, setStateValue] = useState<T>(
    !isUndefined(value) ? value : !isUndefined(defaultValue) ? defaultValue : defaultStateValue
  );

  useEffect(() => {
    // 第一次渲染时候，props.value 已经在useState里赋值给stateValue了，不需要再次赋值。
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    // 外部value等于undefined，也就是一开始有值，后来变成了undefined（
    // 可能是移除了value属性，或者直接传入的undefined），那么就更新下内部的值。
    // 如果value有值，在下一步逻辑中直接返回了value，不需要同步到stateValue
    if (value === undefined) {
      setStateValue(value);
    }
  }, [value]);

  const mergedValue = isUndefined(value) ? stateValue : value;

  return [mergedValue, setStateValue, stateValue];
}

```

## 10.预加载图片

```TS
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
```