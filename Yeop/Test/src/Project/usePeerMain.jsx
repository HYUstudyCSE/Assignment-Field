// usePeer Main 구현
import { useContext, useState, useEffect } from "react";
import Peer from "peerjs";
import { Context } from './ProjectApp'

export function usePeer(page) {
  const contextData = useContext(Context);
  const peerObject = contextData.current.Peer.PeerObject;
  const connList = contextData.current.Peer.connectionOnList;

  const [isLoading, setIsLoading] = useState(0); // 0 : 로딩전 1: 중 2: 완료 3: 연결 실패
  
  const idPrefix = "Prefix_Part_";

  useEffect(() => {
    
    switch (page) {
      case "Main":
	      break;
    }

    return () => {
      switch (page) {
        case "Main":
          break;
      }
    }
  })

  const PeerStart = (isHost, name, avatar, remotePeerId = null) => {
    //PeerId 생성, 생성결과: 대문자 알파벳 5자리 ex. ADSBC
    let peerId = "";

    for (let i = 0; i < 5; i++) {
      peerId += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }

    setIsLoading(1);

    const peer = new Peer(idPrefix + peerId);

    if (isHost) {
      peer.on("open", () => {
        setIsLoading(2);
      });

      contextData.current.HostData.UserList.push({
        name: name,
        avatarIndex: avatar,
        userState: "Lobby",
        peerId: peerId,
        isReturn: false,
      });
    }
    else {
      const conn = peer.connect(idPrefix + remotePeerId);

      conn.on("open", () => {
        if(conn.open){
          setIsLoading(2);
          connList.push(conn);

          conn.send({
            type: "user",
            data: {
		          name: name,
		          avatarIndex: avatar,
		          userState: "Lobby",
		          peerId: peerObject.id,
		          isReturn: false,
	          }
          });
        }
        else{
          conn.close();
          reconnect();
        }
      });
    }

    peerObject = peer;
    contextData.current.isHost = isHost;

    const reconnect = (count = 0) => {
      const conn = peerObject.connect(idPrefix + remotePeerId);
  
      conn.on("open", () => {
        if(conn.open){
          setIsLoading(2);
          connList.push(conn);
  
          conn.send({
            type: "user",
            data: {
              name: name,
              avatarIndex: avatar,
              userState: "Lobby",
              peerId: peerObject.id,
              isReturn: false,
            }
          });
        }
        else{
          conn.close();
          if(count < 5)
            setTimeout(() => reconnectCount(count + 1), 1000);
          else{
            setIsLoading(3);
          }
        }
      });
    }
  };

  switch (page) {
    case "Main":
      return {PeerStart, isLoading};
  }
}