import express from "express";
import http from "http";
import {Server} from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let sharedData = {index: 0};
app.use(express.static("public"));

// Serve a basic route to confirm server is up


io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("play-audio", () => {
        io.emit("play-audio");
    });
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
