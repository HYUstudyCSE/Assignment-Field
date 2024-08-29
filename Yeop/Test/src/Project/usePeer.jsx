// usePeer Main 구현
import React, { useContext, useState } from "react";
import Peer from "peerjs";
import { Context } from "./ProjectApp";

export function usePeer(page) {
  //context들 받아오기.
  const contextData = useContext(Context);
  const [isLoading, setIsLoading] = useState(0); // 0 : 로딩전 1: 중 2: 완료

  const PeerStart = (isHost, name, avatar, remotePeerId = null) => {
    //PeerId 생성 로직
    let peerId = "";

    for (let i = 0; i < 5; i++) {
      peerId += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }

    setIsLoading(1);

    const peer = new Peer();
    contextData.current.Peer.peerObject = peer;

    if (isHost) {
      peer.on("open", () => {
        setIsLoading(2);
      });
    } else {
      const conn = peer.connect(remotePeerId);

      conn.on("open", () => {
        setIsLoading(2);
      });

      contextData.current.Peer.connectionOnList.push(conn);
    }

    contextData.current.HostData.UserList.push({
      name: name,
      avatarIndex: avatar,
      userState: "Lobby",
      peerId: peerId,
      isReturn: false,
    });
  };

  const setEventListener = () => {
    switch (page) {
      case "Lobby":
        break;
      case "Result":
        break;
      default:
        break;
    }
  };

  switch (page) {
    case "Main":
      setEventListener();
      return { PeerStart, isLoading };
    case "Lobby":
      setEventListener();
      if (isHost) return;
    //채팅 보내기 함수, 준비 완료 보내기 함수,
    //...
  }
}
