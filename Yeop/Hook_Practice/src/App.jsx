import { createContext, useContext, useDebugValue, useDeferredValue, useEffect, useId, useReducer, useState, useRef, forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useCallback, useTransition, useSyncExternalStore } from 'react'
import './App.css'

const NumberContext = createContext(null);
const ThemeContext = createContext(null);

function App() {
  const a = useSomething();

  const b = useRef({});

  const handleClick = () => {
    b.current.sayHello();
  }

  return (
    <MyContext>
      <Background>
        <InputColor/>
        <UpDownButton/>
        <ForId/>
        {/* <RefTest ref = {b}/> */}
        <ForwardRef ref={b}/>
        <button onClick={handleClick}>Say Hello</button>
        <EffectPartTest/>
        <MemoCallback/>
        <TransitionTest/>
        <SyncExternalStoreTest/>
      </Background>
    </MyContext>
  )
}

function reducer(state, action){
  let result = state;

  switch(action.type){
    case 'add':
      result += 1;
      break;
    case 'minus':
      result -= 1;
      break;
    default:
      break;
  }
  
  return result;
}

function MyContext({children}){
  const [num, numDispatch] = useReducer(reducer, 0);
  const [color, setColor] = useState('light');

  return (
    <NumberContext.Provider value = {{num, numDispatch}}>
      <ThemeContext.Provider value = {{color, setColor}}>
        {children}
      </ThemeContext.Provider>
    </NumberContext.Provider>
  )
}

function InputColor(){
  const themeColor = useContext(ThemeContext);
  const [color, setColor] = useState('');
  const deffered = useDeferredValue(color);
  //https://11001.tistory.com/250
  //useDeferredValue가 입력이 캐시된 상태로 연산 후순위로 밀리는거 같은데, 그러면 비용이 큰 걸 렌더링 해야 효과 볼 수 있음

  useEffect(() => {
    if(deffered){
      themeColor.setColor(deffered);
    }
  }, [deffered])

  return (
    <>
      <input
        type='text'
        placeholder='default theme color is light'
        value={color}
        onChange={e => setColor(e.target.value)}
      />
      {/* <button onClick={() => themeColor.setColor(themeColor.color == 'black' ? 'white' : 'black')}>On, Off dark mode</button> */}
    </>
  )
}

function Background({children}){
  const themeColor = useContext(ThemeContext);

  return (
    <div style={{backgroundColor : themeColor.color}}>
      <h2>Back Ground</h2>
      {children}
    </div>
  )
}

function UpDownButton(){
  const num = useContext(NumberContext);

  return (
    <>
      <h2>Number : {num.num}</h2>
      <button onClick={() => num.numDispatch({type: 'add'})}>UP</button>
      <br/>
      <button onClick={() => num.numDispatch({type: 'minus'})}>Down</button>
    </>
  )
}

function ForId(){
  const id1 = useId();
  const id2 = useId();
  const id3 = useId();

  return (
    <>
      {[id1, id2, id3].map((e, index) => {
        return <p id={e} style={{color : e == id2 ? "red" : "black"}}>ID {index+1} Text</p>
      })}
    </>
  )
}

function useSomething(initialValue = null){
  const [value, setValue] = useState(initialValue);
  useDebugValue("useDebugValue Test");

  return value;
}

function RefTest({ref}){
  return (
    <>
    </>
  )
}

const ForwardRef = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => {
    return {
      sayHello() {
        console.log("Hello");
      }
    };
  }, []);

  return (
    <>
      <p>ref add say hello</p>
    </>
  )
})

//https://medium.com/@jnso5072/react-useeffect-%EC%99%80-uselayouteffect-%EC%9D%98-%EC%B0%A8%EC%9D%B4%EB%8A%94-%EB%AC%B4%EC%97%87%EC%9D%BC%EA%B9%8C-e1a13adf1cd5
function EffectPartTest () {
  useEffect(() => console.log("Effect Act"), []);
  useLayoutEffect(() => console.log("LayoutEffect Act"), []);
  return (
    <>
      <p>LayoutEffect, Effect Test</p>
    </>
  )
}

function MemoCallback(){
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const callback = useCallback(() => { return Number(a) + Number(b); }, [a, b]);
  const num = useMemo(() => callback(), [a, b]);

  return (
    <>
      <p>useMemo, useCallback Component</p>
      <input
        type='number'
        value={a}
        onChange={e => setA(e.target.value)}
        />
      <input
        type='number'
        value={b}
        onChange={e => setB(e.target.value)}
        />
      <p>합: {num}</p>
    </>
  )
}

function TransitionTest(){
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [isPending, startTransition] = useTransition();

  const clickHandle = () => {
    startTransition(() => setB(1)) //의문점: 이거 setA(2)로 했을 때, 결국 a는 1로 렌더링됨. setA(2)의 요청이 후순위로 밀렸음에도 먼저 처리된 게 나옴.
    setA(1)
  }

  const clickHandle2 = () => {
    startTransition(() => setC(2)) //위에 말한 의문점 옮겨놓은거
    setC(1)
  }

  console.log({A:a, B:b, isPending}); 
  console.log({C:c, isPending}); 

  return (
    <>
      <button onClick={clickHandle}>Transition Test!</button>
      <button onClick={clickHandle2}>Transition Test2!</button>
    </>
  )
}

let data = [];
let listeners = [];

const store = {
  subscribe : function (callback) {
    listeners = [...listeners, callback]
    return () => {listeners = listeners.filter(e => e!==callback);}
  },
  getSnapShot : function(){
    return data;
  },
  setData : function (dataa){
    data = dataa;
    listeners.forEach(e => e());
  }
};

function SyncExternalStoreTest(){
  const [cnt, setCnt] = useState(0);
  const list = useSyncExternalStore(store.subscribe, store.getSnapShot);

  const clickHandle = () => {
    store.setData([...list, `data ${cnt}`]);
    setCnt(() => cnt + 1);
  }

  return (
    <>
      <br/>
      {list.forEach(e => <p>{e}</p>)}
      <button onClick={clickHandle}>Input data</button>
    </>
  )
}

export default App