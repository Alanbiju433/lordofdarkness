const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files
app.use(express.static(__dirname));

// Store active users and messages
const users = new Map();
const messages = [];

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle user joining
    socket.on('join', (userData) => {
        const user = {
            id: socket.id,
            username: userData.username,
            joinedAt: new Date()
        };

        users.set(socket.id, user);

        // Send existing messages to new user
        socket.emit('load-messages', messages);

        // Notify others about new user
        socket.broadcast.emit('user-joined', user);

        // Send updated user list
        io.emit('users-list', Array.from(users.values()));
    });

    // Handle new messages
    socket.on('send-message', (messageData) => {
        const user = users.get(socket.id);
        if (!user) return;

        const message = {
            id: Date.now() + Math.random(),
            text: messageData.text,
            user: user,
            timestamp: new Date()
        };

        messages.push(message);

        // Broadcast message to all clients
        io.emit('new-message', message);
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
        socket.broadcast.emit('user-typing', {
            username: users.get(socket.id)?.username,
            isTyping: data.isTyping
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const user = users.get(socket.id);
        if (user) {
            users.delete(socket.id);
            socket.broadcast.emit('user-left', user);
            io.emit('users-list', Array.from(users.values()));
        }
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5500;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
