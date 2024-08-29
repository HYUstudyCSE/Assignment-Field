// usePeer Main 구현
import { useContext, useState } from "react";
import Peer from "peerjs";
import { Context } from './ProjectApp'
import { useEffect } from "react";

export function usePeer(page) {
  const contextData = useContext(Context); //Context Data 받아오기  
  const [gameResult, setGameResult] = useState();

  useEffect(() => {
    if(contextData.current.isHost){
        setGameResult(contextData.current.HostData.gameResult);
    }
  }, []);

  const setEventListener = () => {
    switch (page) {
      case "Result":
	      break;
    }
  };

  const sendReturnToLobby = () => {

  }

  switch (page) {
    case "Result":
      setEventListener();
      return {gameResult, sendReturnToLobby};
  }
}