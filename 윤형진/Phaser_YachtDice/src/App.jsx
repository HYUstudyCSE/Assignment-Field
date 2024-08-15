import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { YachtDiceGame } from './YachtDiceGame';
import './App.css';

const App = () => {
  const gameContainer = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      scene: new YachtDiceGame(),
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;
    gameContainer.current.appendChild(game.canvas);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="phaser-container">
      <div ref={gameContainer} className="game-container"></div>
    </div>
  );
};

export default App;
