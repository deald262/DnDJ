import express from "express";
import http from "http";
import {Server} from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let sharedData = {index: 0};
let initiativeTracker = {turn: 0, players: [{name: "name"}, {name: "player2"}]};
app.use(express.static("public"));

// Serve a basic route to confirm server is up


io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("play-audio", () => {
        io.emit("play-audio");
    });

    socket.on("addPlayer", (player) => {
        initiativeTracker.players.push({name: player});
        console.log("Player " + player + " has been added");
        io.emit("player-added", initiativeTracker);
    })
    io.emit("player-added", initiativeTracker);
    socket.on("nextPlayer", () => {
        console.log("Turn: " + initiativeTracker.turn+1 + " of " + initiativeTracker.players.length + " players");
        initiativeTracker.turn++;
        if(initiativeTracker.players.length===initiativeTracker.turn){
            initiativeTracker.turn=0;
            console.log("new turn");
        }
        io.emit("next-player", initiativeTracker.turn);
    })
    socket.on('setIndex', (newMessage) => {
        sharedData.index = newMessage;
        console.log(sharedData.index);
        io.emit('global-updated', sharedData); // Emit to all connected clients
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

const localIp = '0.0.0.0'; // Or use your local IP address (e.g., '192.168.128.1')
const port = 8000;
server.listen(port, localIp, () => {
    console.log(`Server listening on http://${localIp}:${port}`);
});


//ngrok http 8000
