const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    // Просто пересылаем технические P2P сигналы между компами
    socket.on('signal', (data) => {
        socket.broadcast.emit('signal', data);
    });
});

http.listen(3000, () => {
    console.log('Сигнальный сервер запущен на порту 3000');
});