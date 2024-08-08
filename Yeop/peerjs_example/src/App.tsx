import { useState, useEffect, useRef } from 'react'
import './App.css'
import Peer from 'peerjs';

function App() {
  const [peerIdText, setPeerIdText] = useState<string>();
  const [remotePeerId, setRemotePeerId] = useState<string>();
  const peerId = useRef<string>();
  const peerIns = useRef<Peer>();
  const idFront = "PeerJs_Example_asdfsesdf_";

  useEffect(() => {
    const idNumber : number = Math.floor(Math.random() * 99999999);
    peerId.current = idFront + String(idNumber);

    const peer: Peer = new Peer(peerId.current);
    peerIns.current = peer;

    peer.on('open', id => {
      console.log(id);
      setPeerIdText(String(idNumber));
    })

    peer.on('connection', conn => {
      conn.on('data', data => {
          console.log(data);
      })
    })

    peer.on('disconnected', () => {console.log('peer disconnected with server');});
    peer.on('error', (e)=>{console.log(`peer error occurred ${e}`);});
    return () => {peer.disconnect();};
  }, []);

  const connectPeer = () => {
      if(!peerIns.current || !remotePeerId)
        return;
      const conn = peerIns.current.connect(idFront + remotePeerId);
      conn.on('open', () => {
          conn.send({text: "hi"});

          conn.on('data', (data) => {
              console.log(data);
          });
      })
      
  }
  return (
  <div>
    <h1>PeerJS Example</h1>
    <h2>Your ID: {peerIdText}</h2>
    <input
      type='text'
      placeholder='Enter remote peer id'
      value={remotePeerId}
      onChange={(e) => (setRemotePeerId(() => e.target.value))}
    />
    <button onClick={connectPeer}>Connect</button>
  </div>
  )
}

export default App
