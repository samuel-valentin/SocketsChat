"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");

const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();

app.use('', express_1.default.static(path_1.default.join(__dirname, '..', 'public')));

app.get('', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'public', 'views', 'index.html'));
});

app.get('/chat/:id', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'public', 'views', 'chat.html'));
});

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const io = new socket_io_1.Server(server);

io.on('connection', (socket) => {
    console.log('Client connected');

    // When the user joins a room
    socket.on('joinRoom', ({ username, room }) => {
        socket.join(`room-${room}`);
        console.log(`${username} joined room ${room}`);

        // Notify other users in the room that the user has joined
        socket.to(`room-${room}`).emit('message', {
            username: 'System',
            text: `${username} has joined the chat`,
            timestamp: new Date().toLocaleTimeString(),
        });

        // Send a welcome message to the user who joined
        socket.emit('message', {
            username: 'System',
            text: `Welcome to room ${room}, ${username}`,
            timestamp: new Date().toLocaleTimeString(),
        });
    });

    // When the user sends a message
    socket.on('sendMessage', (data) => {
        const { username, room, text } = data;
        const messageData = {
            username,
            text,
            timestamp: new Date().toLocaleTimeString(),
        };

        // Emit the message to everyone in the room, including the sender
        io.to(`room-${room}`).emit('getMessage', messageData);
    });

    // When a user is disconnecting
    socket.on('disconnecting', () => {
        const rooms = Array.from(socket.rooms).filter(room => room !== socket.id);
        rooms.forEach(room => {
            io.to(room).emit('message', {
                username: 'System',
                text: `A user has left the chat`,
                timestamp: new Date().toLocaleTimeString(),
            });
        });
    });

    // When a user fully disconnects
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
