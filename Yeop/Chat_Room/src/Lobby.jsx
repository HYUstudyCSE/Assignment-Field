import { useState, useEffect, useRef } from "react";
import Peer from "peerjs";

function Lobby({name, isAdmin, remotePeerId}){
    const [names, setNames] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [peerId, setPeerId] = useState('');
    const [conns, setConns] = useState([]);
    const peerInstance = useRef(null);
    const connInstance = useRef(null);
  
    useEffect(() => {
        console.log({name: name, isAdmin: isAdmin, remotePeerId: remotePeerId});

        const peer = new Peer();
        peerInstance.current = peer;

        peer.on('open', id => {
            setPeerId(id);
            console.log(`My peer id: ${peerId}`);
        })

        peer.on('connection', conn => {
            console.log('someone connected');
            setConns(prevConns => [...prevConns, conn]);

            conn.on('data', data => {
                console.log('received data');
                console.log(data);

                setMessages(prevMsgs => [...prevMsgs, {sender: data.sender, text: data.text}]);

                if(!isAdmin)
                    return;
                for(const conn of conns){
                    conn.send({sender: data.sender, text: data.text});
                }
            })
        })

        peer.on('disconnected', () => {
            console.log('peer disconnected with server');
        })

        peer.on('error', (e)=>{
            console.log('peer error occurred');
            console.log(e);
        })

        return () => {
            peer.disconnect();
        }
    }, []);

    useEffect(()=>{
        if(!isAdmin){
            const conn = peerInstance.current.connect(remotePeerId);
            console.log(conn);
            console.log('connect act');
            connInstance.current = conn;
            conn.on('open', () => {
                console.log('hi');
                conn.send({sender: name, text: `${name}님 입장!`});
            })
          }
    },[peerInstance.current]);
  
    const sendMessage = () => {
      if(!message.trim())
        return;
  
      console.log('send');
      if(isAdmin){
        setMessages(prevMsgs => [...prevMsgs, {sender: name, text: message}]);
        for(const conn of conns)
            conn.send({sender: name, text: message});
      }
      else{
        connInstance.current.send({sender: name, text: message});
      }
      setMessage(() => '');
    }
  
    return (
      <div className='app'>
        <h1>Chat Room</h1>
        <h2>Lobby</h2>
        {isAdmin ? <h2>Peer ID: {peerId}</h2> : null}
        <br/>
        <h2>Messages</h2>
        <div>
          {messages.map((msg) => (
            <p>{msg.sender}: {msg.text}</p>
          ))}
        </div>
        <input
          type='text'
          placeholder='Enter message'
          value={message}
          onChange={e => (setMessage(() => e.target.value))}
        />
        <button onClick={sendMessage}>Send</button>
        <button onClick={() => console.log(peerInstance.current.connect(remotePeerId))}>connect test</button>
      </div>
    )
}

export default Lobby;