import React from 'react';
import PlayerBlock from './PlayerBlock';
import Puck from './Puck';

const Game = ({player}) => {

    console.log(player);
    

  return (
    <>

    <PlayerBlock player={player}></PlayerBlock> 
    {/* <Puck></Puck> */}
    
    </>
  );
};

export default Game;