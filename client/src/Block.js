// Block.js
import React from 'react';
import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3001");

const Block = () => {

    const [position, setPosition] = useState({ x: 0, y: 0 });
    var localposition = { x: 0, y: 0 };
    
    const keysPressed = {};
  
    const handleKeyDown = (e) => {
      keysPressed[e.key] = true;
      console.log("keydwn");
    };
  
    const handleKeyUp = (e) => {
      keysPressed[e.key] = false;
      console.log("keyup");
    };
  
    const step = 5;
    //console.log("first");
    
  
    useEffect(() => {
      // Add event listeners for keydown and keyup
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      console.log("hello");
  
      // Cleanup: remove event listeners when the component unmounts
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }, []); // Empty dependency array ensures that the effect runs once on mount
  
    useEffect(() => {
      socket.on("recieve", (data) => {
        setPosition(data.message);
        console.log(position);
      });
    }, []);


    const intfunc = () => {
      const interval = setInterval(() => {
        localposition = position;
        if (keysPressed["w"])
           { localposition.y = localposition.y - step;
            setPosition((prev) => ({ ...prev, y: prev.y - step }));;
        }
          
        else if (keysPressed["s"])
            {localposition.y = localposition.y + step;
                setPosition((prev) => ({ ...prev, y: prev.y + step }));}
          //setPosition((prev) => ({ ...prev, y: prev.y + step }));
        if (keysPressed["a"])
            {localposition.x = localposition.x - step;
                setPosition((prev) => ({ ...prev, x: prev.x - step }));}
          //setPosition((prev) => ({ ...prev, x: prev.x - step }));
        else if (keysPressed["d"])
            {localposition.x = localposition.x + step;
                setPosition((prev) => ({ ...prev, x: prev.x + step }));}
          //setPosition((prev) => ({ ...prev, x: prev.x + step }));
        
        
        console.log(localposition);
        socket.emit("message", {message: localposition});
        //console.log("inside interval");
      }, 10);
  
      // Cleanup: clear interval when component unmounts or when intfunc is called again
      return () => clearInterval(interval);
    };

    // useEffect(() => {
    //     intfunc();
    // });

    return (
      <>
       <button
          onClick={intfunc}
          style={{ fontSize: "20px", padding: "10px" }}
        >
          sender
        </button>
        <div className="App">
          <div
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "blue",
              position: "absolute",
              top: `${position.y}px`,
              left: `${position.x}px`,
            }}
          ></div>
        </div>
      </>
    );
};

export default Block;
