const socket = new WebSocket('ws://localhost:3000');

socket.onmessage = (event) => {
    const chat = document.getElementById('chat');
    const newMessage = document.createElement('div');

    const parsedData = JSON.parse(event.data);
    newMessage.innerHTML = `<span style="color: ${parsedData.color}; font-weight: bold;">${parsedData.nickname}:</span> ${parsedData.message}`;

    chat.appendChild(newMessage);
    chat.scrollTop = chat.scrollHeight; 

    if (document.hidden) {
        document.title = `Нове повідомлення від ${parsedData.nickname}`;
    }
};

function sendMessage() {
    const messageInput = document.getElementById('message');
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.send(JSON.stringify({ message })); 
        messageInput.value = ''; 
    }
}

socket.onopen = () => {
    console.log('З’єднання відкрите');
};

socket.onerror = (error) => {
    console.error('Помилка WebSocket:', error);
};

socket.onclose = () => {
    console.log('З’єднання закрите');
};

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        document.title = 'Чат на WebSocket';
    }
});