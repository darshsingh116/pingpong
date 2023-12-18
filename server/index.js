const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

var puckPosition = {x:0 , y:30 };
var localposition1 = { x: 300, y: 300 };
var localposition2 = { x: 1100, y: 300 };
var scores = {p1:0 , p2:0};

var playerconnected = [false , false];

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://pingpong-not-blackbucks-projects.vercel.app",
        methods : ["GET" , "POST"],
    }
})

io.on("connection", (socket) =>{
    console.log(`user connected : ${socket.id}`);

    socket.on("p1", (data) => {
        // console.log("p1");
        // console.log(data);
        //socket.broadcast.emit("p1", data);
        localposition1 = data;
    }), 

    socket.on("p2", (data) => {
        // console.log("p2");
        // console.log(data);
        //socket.broadcast.emit("p2", data);
        localposition2 = data;
    })

    socket.on("init", (data) => {
        playerconnected[data-1] = true;
    })


    

    

    socket.on("GameStart", (data) => {
        puckPosition = {x: 700, y:340};
        scores = {p1:0 , p2:0};
        console.log(playerconnected);
        
        if(playerconnected[0] && playerconnected[1]){gameStart();}
    })

    function gameStart(){
        puckPosition = {x: 700, y:340};
        var velocity = {x:5,y:0};
        var puckDir = {x:0, y:0};
        //var lastplayerpos = { x1:0, x2:0 , y1:0, y2:0}; //used to get vertical direction of player
        var collision = { x1:0, x2:0 , y1:0, y2:0};  
        const physics = setInterval( () => {

            // console.log("puck movement start");
            // if(puckPosition.x < 1500 && puckPosition.y < 1500 && (puckDir.x%2)===0){
            //     puckPosition.x = puckPosition.x + velocity.x;
            //     //puckPosition.y = puckPosition.y + velocity.y;
            // }else if (puckPosition.x > 0 && puckPosition.y > 0 && (puckDir.x%2)===1){ 
            //     puckPosition.x = puckPosition.x - velocity.x;
            //     //puckPosition.y = puckPosition.y - velocity.y;
            // }else{puckDir.x++;}

            collision = { x1:0, x2:0 , y1:0, y2:0}; 
            collision.x1 = localposition2.x-puckPosition.x;
            collision.y1 = localposition2.y - puckPosition.y;
            collision.x2 = puckPosition.x-localposition1.x;
            collision.y2 = localposition1.y - puckPosition.y;
            console.log(collision);

            if((collision.x1 < 10) && ((collision.y1 < 5) && (collision.y1 >= -85)) && (puckDir.x%2)===0){
                console.log(collision);
                puckDir.x++;
                collision.y1 = collision.y1 + 85;
                if(collision.y1 === 45) { velocity.y = 0;}
                if(collision.y1 > 45){
                    velocity.y = -(0.21 * (collision.y1-45));
                }else if(collision.y1 < 45){
                    velocity.y = (0.21 * ((-1) * (collision.y1 - 45)));
                }
                

                //puckPosition.x = puckPosition.x + velocity.x;
                //puckPosition.y = puckPosition.y + velocity.y;
            }else if ((collision.x2 < 10) && ((collision.y2 < 5) && (collision.y2 > -85)) && (puckDir.x%2)===1){ 
                //console.log(collision);
                puckDir.x++;
                collision.y2 = collision.y2 + 85;

                if(collision.y2 === 45) { velocity.y = 0;}
                if(collision.y2 > 45){
                    //console.log(collision.y2-45);
                    velocity.y = -(0.21 * (collision.y2-45));
                    console.log(velocity.y);
                } else if(collision.y2 < 45){
                    velocity.y = (0.21 * ((-1) * (collision.y2 - 45)));
                }

                //console.log(velocity);

                //puckPosition.x = puckPosition.x - velocity.x;
                //puckPosition.y = puckPosition.y - velocity.y;
            }

            if((puckDir.x%2)===0){
                velocity.x = 10;
                //puckPosition.y = puckPosition.y + velocity.y;
            }else if ((puckDir.x%2)===1){ 
                velocity.x = -10;

                //puckPosition.y = puckPosition.y - velocity.y;
            }
            


            puckPosition.x = puckPosition.x + velocity.x;
            puckPosition.y = puckPosition.y + velocity.y;



            if(puckPosition.x < 200 || puckPosition.x > 1200){
                clearInterval(physics);
                if(puckPosition.x < 200){scores.p2++;}
                if(puckPosition.x > 1200){scores.p1++;}
                io.emit("roundEnd", {scores});
                gameStart();
            }
            if(puckPosition.y < 0 || puckPosition.y > 700){
                console.log(velocity.y)
                velocity.y = (-1) * velocity.y;
                console.log(velocity.y)
                console.log("~~");
            }




            //console.log(puckDir);

          
            

            //console.log({puckPosition,localposition1,localposition2});
            io.emit("serverState", {puckPosition,localposition1,localposition2});
            //socket.broadcast.emit("puckPositionUpdate", puckPosition);

        }, 10)

        socket.on('disconnect', () => {
            console.log(`user disconnected: ${socket.id}`);
            playerconnected[0] = false;
            playerconnected[1] = false;
            velocity = {x:10,y:0};
            clearInterval(physics);
        });
    }

    
});

app.get("/",(req,res) => {res.send("hello")});

server.listen(3001,() => {
    console.log("server is running");
});