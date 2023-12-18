import "./App.css";
import { useEffect, useState} from "react";
import PlayerBlock from "./PlayerBlock";
import Game from "./Game";
import React from 'react';

function App() {
  const [player ,setPlayer] = useState(0);

  const Startgame = (p) => {
    setPlayer(p);
  }
  console.log("first");
  return (
    <>
    <div>
    <button onClick={() => Startgame(1)}> Player 1 </button>
    <button onClick={() => Startgame(2)}> Player 2 </button>
    </div>
      

      {player===0?<div></div>:(player===1?<Game player={1}></Game> : <Game player={2}></Game>)}
    
        </>
  );

  
}

export default App;
