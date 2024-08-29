import { useContext, createContext, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import LobbyPage from "./LobbyPage";

// App.jsx
export const Context = createContext();

export default function ProjectApp() {
  const setInitialData = () => ({
    isHost: false,
    Peer: {
      PeerObject: {},
      connectionList: [],
    },
    UserData: {},
    GameData: {
      GameList: [
        {
          Name: "Big Two",
          Description: "Card Game 어쩌고 good",
          Rule: "대충 긴 텍스트",
          PlayerCountRange: [3, 5],
          GameIcon: "@/public/image/BigTwoIcon.png",
          GameFile: "@/src/games/BigTWo.js",
          CustomSetting: {
            UseJoker: false,
            TurnTimeLimit: "20sec",
            //...
          },
        },
        {
          //...
        },
      ],
    },
    HostData: {
      UserList: [
        {
          name: "adf",
          avatarIndex: 3, // 아바타 이미지들에 붙은 인덱스로 사용
          userState: "Lobby", // ”Lobby”, “GamePlaying”, “GameEnd”, “Result”
          peerId: "AKSHV",
          isReturn: true, // Result화면에서 Lobby로 돌아갈 건가에 대한 변수
        },
      ],
      selectedGameIndex: 0,
      GameSetting: {
        //Game 상세 데이터의 CustomSetting에서 가져오기
      },
      RoomSetting: {
        maxPlayer: 4,
        //...
      },
      GameResult: {
        rank: ["Amy", "Steve", "Clara", "John"],
      },
    },
  });
  const data = useRef(setInitialData());

  return (
    <BrowserRouter>
      <Context.Provider value={data}>
        <Routes>
          {/*화면 Components, Router 사용*/}
          <Route path="/" element={<MainPage />} />
          <Route path="/Lobby/*" element={<LobbyPage />} />
          {/* <Route path="/PlayingGame/*" element={<GamePage />} />
          <Route path="/Results/*" element={<ResultPage />} />
          <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Context.Provider>
    </BrowserRouter>
  );
}
