const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 3000 });
const clients = new Map(); 
let userCount = 0;

server.on('connection', (ws) => {
    userCount++;
    const nickname = `user#${String(userCount).padStart(4, '0')}`;
    const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    
    clients.set(ws, { nickname, color });
    
    console.log(`${nickname} приєднався до чату`);
    broadcast(`${nickname} приєднався до чату.`, nickname, color);

    ws.on('message', (data) => {
        const message = JSON.parse(data).message;
        console.log(`[${nickname}]: ${message}`);
        broadcast(message, nickname, color);
    });

    ws.on('close', () => {
        const user = clients.get(ws);
        console.log(`${user.nickname} залишив чат`);
        broadcast(`${user.nickname} залишив чат.`, user.nickname, user.color);
        clients.delete(ws);
    });

    ws.on('error', (error) => {
        console.error('Помилка WebSocket:', error);
    });
});

function broadcast(message, nickname, color) {
    const data = JSON.stringify({ message, nickname, color });
    clients.forEach((_, client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

console.log('Сервер чату запущений на ws://localhost:3000');
