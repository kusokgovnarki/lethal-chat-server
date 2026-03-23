const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });

io.on('connection', (socket) => {
    // Вход в комнату
    socket.on('join-room', (roomName) => {
        socket.join(roomName);
        socket.to(roomName).emit('user-joined', socket.id);
    });

    // Адресная пересылка ключей для P2P
    socket.on('signal', (data) => {
        if (data.to) {
            io.to(data.to).emit('signal', {
                from: socket.id,
                signal: data.signal
            });
        }
    });

    socket.on('disconnect', () => {
        io.emit('user-left', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Server Online'));