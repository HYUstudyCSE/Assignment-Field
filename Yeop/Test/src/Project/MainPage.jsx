import { useEffect, useState } from "react";
import { usePeer } from "./usePeer";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const get = usePeer("Main");
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    if (get.isLoading == 2) {
      navigate("/Lobby");
    }
  }, [get.isLoading]);
  return (
    <>
      <h2>Here is Main Page</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={() => get.PeerStart(true, name, 0)}>Make Room</button>
      <button onClick={() => get.PeerStart(false, name, 0, null)}>
        Join Room
      </button>
    </>
  );
}
