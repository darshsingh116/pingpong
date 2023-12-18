import React from 'react';
import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import "./Puck.css";

const socket = io.connect("https://pingpong-v5z5.onrender.com");




const PlayerBlock = ({player}) => {

  //var puckPosition = {x: 700, y:330};
  const [puckPositionDOM , setpuckPositionDOM] = useState({x: 700, y:330});
  const [scores , setScores] = useState({p1:0 , p2:0});

  useEffect(() => {
    socket.emit("init", player);
    socket.emit("GameStart", {});
    console.log("game starto");
  },[]);

    const [position1, setPosition1] = useState({ x: 300, y: 300 });
    var localposition1 = { x: 300, y: 300 };

    const [position2, setPosition2] = useState({ x: 1100, y: 300 });
    var localposition2 = { x: 1100, y: 300 };
    
    const keysPressed = {};
  
    const handleKeyDown = (e) => {
      keysPressed[e.key] = true;
      //console.log("keydwn");
    };
  
    const handleKeyUp = (e) => {
      keysPressed[e.key] = false;
      //console.log("keyup");
    };
  
    const step = 10;



























    //////////////////UPDATING  SERVER STATE TO LOCAL CLIENT
    useEffect(() => {
      socket.on("serverState", (data) => {
        console.log(data);
        setPosition1(data.localposition1);
        setPosition2(data.localposition2);
        //puckPosition = data.puckPosition;
        setpuckPositionDOM(data.puckPosition);
        // serverposition1 = data.localposition1;
        // serverposition2 = data.localposition2;
      });


      socket.on("roundEnd", (data) => {
        setScores(data.scores);
      });
    },[]);

    // useEffect(() => {
    //   setPosition1(serverposition1);
    //   setPosition2(serverposition2);
    // },[serverposition1]);
    
    

















    ///////////// LISTENING INPUT
    useEffect(() => {
      // Add event listeners for keydown and keyup
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      //console.log("hello");
      console.log("test1");
  
      // Cleanup: remove event listeners when the component unmounts
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }, []); // Empty dependency array ensures that the effect runs once on mount
  
    // useEffect(() => {
    //   console.log("test2");

    //   if(player === 2){
    //     socket.on("p1", (data) => {
    //       setPosition1(data.serverposition);
    //       console.log(position1);
    //     });
    //   }else if(player === 1){
    //     socket.on("p2", (data) => {
    //       setPosition2(data.serverposition);
    //       //console.log(position2);
    //     });
    //   }
      
    // }, []);

















    //////// FUNCTION WHICH UPDATES CLIENT MOVEMENTS LOCALLY AND ADDED TO KINDOF BUFFER
    const intfunc = () => {
      const localPlayerController = setInterval(() => {
      if(player===1){

        localposition1 = position1;
        if (keysPressed["w"])
           { localposition1.y = localposition1.y - step;
            //setPosition1((prev) => ({ ...prev, y: prev.y - step }));;
        }          
        else if (keysPressed["s"])
            {localposition1.y = localposition1.y + step;
              //setPosition1((prev) => ({ ...prev, y: prev.y + step }));
            }

        //////////////////////////////////////////////////////////////////////////////    
        //console.log(localposition1);
        //socket.emit("p1", {serverposition: localposition1});

        }else if(player === 2 ){
          localposition2 = position2;
        if (keysPressed["w"])
           { localposition2.y = localposition2.y - step;
            //setPosition2((prev) => ({ ...prev, y: prev.y - step }));;
        }          
        else if (keysPressed["s"])
            {localposition2.y = localposition2.y + step;
                //setPosition2((prev) => ({ ...prev, y: prev.y + step }));
              }
          
        
        
        //console.log(localposition1);
        //socket.emit("p2", {serverposition: localposition2});
        }
        //console.log("inside interval");
      }, 10);
    
    





      //////////// SENDING USERINPUT TO SERVER TO PROCESS
      const serverGameState = setInterval(() => {
        if(player === 1){
          socket.emit("p1", localposition1);
        }else{
          socket.emit("p2", localposition2);
        }
      }, 10)

      // Cleanup: clear interval when component unmounts or when intfunc is called again
      return () => {clearInterval(localPlayerController);
        clearInterval(serverGameState);}
    };



















    
    ////////STARTING INPUT LISENER
    useEffect(() => {
      console.log("test3");
        intfunc();
    },[]);

    return (
      <>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '200px',
          width: '1000px', // Adjust the width as needed
          height: '700px', // Adjust the height as needed
          border: '1px solid #000', // Thin border color
        }}></div>
      
        <div className="App">
        
          <div
            style={{
              width: "10px",
              height: "80px",
              backgroundColor: "#3498db",
              position: "absolute",
              top: `${position1.y}px`,
              left: `${position1.x}px`,
            }}
          ></div>

          <div
            style={{
              width: "10px",
              height: "80px",
              backgroundColor: "#3498db",
              position: "absolute",
              top: `${position2.y}px`,
              left: `${position2.x}px`,
            }}
          ></div>


      <div class="pong-puck"style={{
          top: `${puckPositionDOM.y}px`,
          left: `${puckPositionDOM.x}px`,
        }}></div>


        

    
        </div>
        {/* Score Column */}
        <div
          style={{
            position: 'absolute',
            top: '600px',
            left: '700px',
            transform: 'translateX(-50%)',
            display: 'flex',
            justifyContent: 'space-between',
            width: '200px', // Adjust the width as needed
            color: '#000000', // Adjust the text color
            fontSize: '30px', // Adjust the font size
            fontWeight: 'bold', // Make the text bold
          }}
        >
          <div>P1: {scores.p1}</div>
          <div>P2: {scores.p2}</div>
        </div>
      </>
    );
};

export default PlayerBlock;
