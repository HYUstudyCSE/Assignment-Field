import { createContext, useContext, useState, useRef, useEffect } from "react";

const Context = createContext();

export default function App2() {
  return (
    <Provider>
      <RenderingPart />
    </Provider>
  );
}

function Provider({ children }) {
  const data = useRef({
    message: ["hi", "hello"],
  });

  return <Context.Provider value={data}>{children}</Context.Provider>;
}

function RenderingPart() {
  const data = useContext(Context);
  const [message, setMessage] = useState(data.current.message);
  const [text, setText] = useState("");

  useEffect(() => {
    setMessage(data.current.message);
  }, [data.current.message]);

  return (
    <>
      {message.map((e) => {
        return <p>{e}</p>;
      })}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          data.current.message.push(text);
          setText("");
        }}
      >
        Text Upload
      </button>
    </>
  );
}
