// server.js
const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('client'));

let gameResults = { crosses: 0, circles: 0 };

wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'results', data: gameResults }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'result') {
            const result = data.data.result;
            if (result === 'crosses_win') {
                gameResults.crosses++;
            } else if (result === 'circles_win') {
                gameResults.circles++;
            }
            updateMainGame(result);
            broadcastGameResults();
        }
    });
});

function broadcastGameResults() {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'results', data: gameResults }));
        }
    });
}

// Serve your HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
