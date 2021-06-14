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