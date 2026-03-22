const express = require('express');
const app = express();
const http = require('http').createServer(app);

// ВОТ ЗДЕСЬ ИСПРАВЛЕНИЕ: разрешаем входящие соединения со всех адресов
const io = require('socket.io')(http, {
    cors: {
        origin: "*", // Разрешаем всем (для тестов это ок)
        methods: ["GET", "POST"]
    }
});

const path = require('path');

// Это нужно, если ты решишь открыть сервер просто в браузере
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('Новое подключение:', socket.id);

    socket.on('signal', (data) => {
        // Ретранслируем сигнал всем, кроме отправителя
        socket.broadcast.emit('signal', data);
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });
});

// Render сам подставит нужный порт в переменную PORT
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Сигнальный сервер запущен на порту ${PORT}`);
});