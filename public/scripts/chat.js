document.addEventListener('DOMContentLoaded', () => {
    const socket = io('/');
    const messageInput = document.getElementById('message');
    const messagesContainer = document.getElementById('messages');
    const roomId = window.location.href.split('/').pop();
    const username = localStorage.getItem('username');

    if (!username) {
        alert('Please enter a name to join the chat.');
        window.location.href = '/';
        return;
    }

    socket.emit('joinRoom', { username, room: roomId });

    socket.on('getMessage', (message) => {
        renderMessage(message, message.username === username ? 'self' : 'other');
    });

    socket.on('message', (notification) => {
        showNotification(notification);
    });

    document.getElementById('trigger').addEventListener('click', () => {
        const text = messageInput.value.trim();
        if (!text) return;

        const messagePayload = {
            username,
            room: roomId,
            text,
            timestamp: new Date().toLocaleTimeString(),
        };

        socket.emit('sendMessage', messagePayload);

        messageInput.value = '';
    });

    function renderMessage(message, messageType) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', messageType);
        messageElement.innerHTML = `<strong>${message.username}</strong> <span>(${message.timestamp}):</span> ${message.text}`;
        messagesContainer.appendChild(messageElement);
    }

    function showNotification(notification) {
        const notificationElement = document.createElement('div');
        notificationElement.classList.add('notification');
        notificationElement.innerHTML = `<em>${notification.text}</em>`;
        messagesContainer.appendChild(notificationElement);
    }
});
