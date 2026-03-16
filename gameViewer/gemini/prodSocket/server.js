const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

app.use(express.static('public'));

// 起動時にファイルからデータを読み込む
let kanbanData = { 'todo-list': [], 'wait-list': [], 'stadiumA-list': [], 'stadiumB-list': [], 'stadiumC-list': [], 'stadiumD-list': [] };
if (fs.existsSync('data.json')) {
    kanbanData = JSON.parse(fs.readFileSync('data.json'));
}

io.on('connection', (socket) => {
    socket.emit('sync', kanbanData);
    socket.on('change', (data) => {
        kanbanData = data;
        fs.writeFileSync('data.json', JSON.stringify(kanbanData)); // ファイル保存
        io.emit('sync', kanbanData); // 全員へ通知
    });
});

http.listen(3000, () => console.log('Server running on http://localhost:3000'));