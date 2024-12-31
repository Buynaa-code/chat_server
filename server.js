const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Апп үүсгэх
const app = express();
app.use(cors());

// HTTP сервер үүсгэх
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Серверийн тохиргоо (Config)
const PORT = process.env.PORT || 3000;
const LOG_FILE = path.join(__dirname, 'server.log');

// Лог бичих функц
function logMessage(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
}

// Socket үйлдэл
io.on('connection', (socket) => {
  logMessage(`Хэрэглэгч холбогдлоо: ${socket.id}`);

  socket.on('sendMessage', (data) => {
    logMessage(`Хэрэглэгч ${socket.id} зурвас илгээв: ${JSON.stringify(data)}`);
    io.emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    logMessage(`Хэрэглэгч саллаа: ${socket.id}`);
  });

  // Алдаа барих
  socket.on('error', (error) => {
    logMessage(`Алдаа гарсан: ${error}`);
  });
});

// Серверийг 3000 порт дээр ажиллуулах
server.listen(PORT, () => {
  console.log(`Сервер http://localhost:${PORT} дээр ажиллаж байна`);
  logMessage('Сервер эхэллээ');
});
