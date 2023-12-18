import { useEffect, useState } from "react";
import "./Puck.css";
import io from "socket.io-client";


const Puck = () => {

  var puckPosition = {x: 700, y:330};

  const socket = io.connect("https://pingpong-v5z5.onrender.com:3001");

  // useEffect(() => {
  //   socket.emit("initPuckPosition", {puckPosition : puckPosition});
  //   console.log("puck pos set");
  // },[]);

  const [puckPositionDOM , setpuckPositionDOM] = useState(puckPosition);


  // useEffect(() => {
    
  //   socket.on("puckPositionUpdate", (data) => {
  //     puckPosition = data;
  //     //console.log(puckPosition);
  //     //setpuckPositionDOM(puckPosition);
  //   });
    
    
  // }, []);

  useEffect(() => {
    socket.on("serverState", (data) => {
      puckPosition = data.puckPosition;
      console.log(puckPosition);
      //setpuckPositionDOM(puckPosition);
    });
  },[]);

  return (
    <>

    <div class="pong-puck"style={{
      top: `${puckPositionDOM.y}px`,
      left: `${puckPositionDOM.x}px`,
    }}></div>
    
    </>
  );
};

export default Puck;