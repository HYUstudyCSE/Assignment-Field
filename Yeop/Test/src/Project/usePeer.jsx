import { useContext, useState, useEffect } from "react";
import Peer from "peerjs";
import { Context } from './ProjectApp'

export function usePeer(page) {
	//Main
  const contextData = useContext(Context);
  const peerObject = contextData.current.Peer.PeerObject;
  const connList = contextData.current.Peer.connectionOnList;

  const [isLoading, setIsLoading] = useState(0); // 0 : 로딩전 1: 중 2: 완료 3: 연결 실패
  
  const idPrefix = "Prefix_Part_";
  
  //Lobby
  //const contextData = useContext(Context);
	const { Peer, GameData, HostData } = contextData.current;
	const peerID = Peer.PeerObject.id;
	
	const [chatList, setChatList] = useState([]);
	const [userReadyList, setUserReady] = useState([]);
	const [userList, setUserList] = useState([]);
	const [isPlaying, setIsPlaying] = useState(False);
	const [selectedGame, selectGame] = useState(HostData.selectedGameIndex); 
	const [gameSetting, changeGameSetting] = useState(GameData.GameList[selectedGame].CustomSetting);
	const [roomSetting, changeRoomSetting] = useState(HostData.RoomSetting);
	
	//Game
	const data = useContext(Context);
	
	const peer = data.Peer.PeerObject;
	//const connList = data.Peer.ConnectionList;

  //Result
  const { Peer: PeerData /*, HostData */} = useContext(Context).current;
  //const peer = PeerData.PeerObject;
  const [gameResult, setGameResult] = useState(HostData.GameResult.rank || []);
  const [users, setUsers] = useState([...HostData.UserList]);

  useEffect(() => {
    
    switch (page) {
      case "Main":
	      break;
	    case 'Lobby':
				if(contextData.current.isHost) Peer.PeerObject.on('connection', handleConnection);
				else handleConnection(contextData.current.Peer.connectionList[0]);
				break;
      case 'Game':
        break;
      case "Result":
        peer.on('connection', setupConnection);
	      if (HostData.isHost){
		      connectionList.forEach(conn => {
			    if (conn.open){
				    conn.send({type:'gameResult',gameResult});
				  }
				});
        }
        break;
    }

    return () => {
      switch (page) {
        case "Main":
          break;
        case 'Lobby':
          connList.forEach(conn => {
              conn.off('data', coveredHandleData);
              conn.off('close', coveredHandleDisconnect);
          });
          data.Peer.PeerObject.off('connection', handleConnection);
          break;
        case 'Game':
          break;
      }
    }
  })
  

  //#region MainPart
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
  //#endregion
  
  
  //#region LobbyPart
  useEffect(() => {
		HostData.UserList = userList;
		broadcastUserList();
	}, [userList]);
	
	useEffect(() => {
		HostData.UserList = userList;
	}, [chatList]);
	
	useEffect(() => {
		HostData.selectedGameIndex = selectedGame;
	}, [selectedGame]);
	
	useEffect(() => {
		HostData.GameSetting = gameSetting;
	}, [gameSetting]);
	
	useEffect(() => {
		HostData.RoomSetting = roomSetting;
	}, [roomSetting]);
	
	useEffect(() => {
		broadcastReady(userReadyList);
	}, [userReadyList]);
	
	const broadcastUserList = () => {
    const data = { type: 'user-list', userList };
    Peer.PeerObject.connections.forEach(connection => connection.send(data));
  };
  
  const broadcastReady = () => {
	  const data = { type: 'user-ready-list', userReadyList};
	  Peer.PeerObject.connections.forEach(connection => connection.send(data));
	};
	
	const broadcastMessage = (data, excludePeerId = null) => {
    Peer.PeerObject.connections.forEach(connection => {
      if (connection.peer !== excludePeerId) connection.send(data);
    });
  };
	
	const sendChat = (message) => {
		if(message){
			const newMessageData = { type: "message", from: peerID, detail: message };
			broadcastMessage(newMessageData);
			if(contextData.current.isHost){
				setChatList([...chatList, newMessageData]);
			}
		}
	}
	
	const startGame = () => {
		setIsPlaying(True);
		const data = { type: "start" };
		Peer.PeerObject.connections.forEach(connection => connection.send(data));
	}
	
	const setGame = (index) => {
		selectGame(index);
		changeGameSetting(GameData.GameList[index].CustomSetting);
		
		const data1 = { type: "game-index", detail: selectedGame };
		const data2 = { type: "game-setting", detail: gameSetting };
		Peer.PeerObject.connections.forEach(connection => connection.send(data1));
		Peer.PeerObject.connections.forEach(connection => connection.send(data2));
	}
	
	const setGameSetting = (data) => {
		changeGameSetting(data);
	}
	
	const setRoomSetting = (data) => {
		changeRoomSetting(data);
	}
	
	const handleReady = (isReady) => {
		const data = { type: "ready", id: Peer.PeerObject.id, value: isReady };
		Peer.PeerObject.connections.forEach(connection => connection.send(data));
	}
	
	const handleDisconnect = (connection) => {
    setUserList(prevList => prevList.filter(user => user.id !== connection.peer));
	};
	
	const coveredHandleData = (data) => handleData(data, connection);
	const coveredHandleDisconnect = () => handleDisconnect(connection);
	
	const handleConnection = (connection) => {
		if(contextData.current.isHost) contextData.current.Peer.connectionList.push(connection);
    connection.on('data', coveredHandleData);
    connection.on('close', coveredHandleDisconnect);
	};
	
	const handleData = (data, connection) => {
    switch (data.type) {
      case 'gameResult':
          setGameResult(data.gameResult);
      case 'updateState':
          setUsers(prevUsers =>
              prevUsers.map(user =>
                  user.peerId === conn.peer ? { ...user, userState: data.userState } : user
              )
          );
      case 'message':
				if (contextData.current.isHost) {
	        broadcastMessage(data, connection.peer);
        }
	      setChatList(prevList => [...prevList, data]);
      case 'user':
        if (contextData.current.isHost) {
	        setUserList(prevList => [...prevList, data.user]);
	        broadcastUserList();
      }
      case 'user-list':
	      setUserList(data.userList);
      case 'user-ready-list':
        setUserReady(data.userReadyList);
      case 'ready':
        if (contextData.current.isHost) {
	        setUserList(prevList => 
		        prevList.map(user => 
			        user.id === data.id ? { ...user, ready: data.value } : user
            )
          );
        }
      case 'start':
	      setIsPlaying(true);
      case 'game-index':
	      selectGame(data.detail);
      case 'game-setting':
        changeGameSetting(data.detail);
      default:
        console.warn(`Unknown data type: ${data.type}`);
        break;
    }
  };			
  //#endregion

  //#region GamePart
  //#endregion
  
  //#region  ResultPart

  
  
// 연결 수락 및 이벤트 리스너 설정
  const setupConnection = (conn) => {
      conn.on('data', (data) => handleData(conn, data));
  };
  
// 유저 상태를 로비로 변경하는 함수
  const sendReturnToLobby = () => {
      const conn = connectionList[0];
      if (conn.open) {
        conn.send({ type: 'updateState', userState: 'Lobby' });
      }
  };
//#endregion
  
  switch (page) {
    case "Main":
      return {PeerStart, isLoading};
    case 'Lobby':
			if(contextData.current.isHost){
				return {chatList, sendChat, startGame, setGame, setGameSetting, setRoomSetting, isPlayingGame};
			}
			else{
				return {chatList, userList, sendChat, handleReady, selectedGameIndex,currentGameSetting, isPlayingGame};
			}
		case "Game":
			return { peer, connList };
    case "Result":
      if (contextData.current.isHost) return { gameResult }; 
      else return { gameResult, sendReturnToLobby }; 
  }
}