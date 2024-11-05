// login.js

document.addEventListener('DOMContentLoaded', () => {
    let username = localStorage.getItem('username');
    
    // Si no hay un nombre de usuario, solicita uno al usuario hasta que ingrese uno válido
    if (!username) {
        while (!username) {
            username = prompt('Enter your name to join the chat:');
            if (!username) {
                alert('A name is required to join the chat.');
            }
        }
        localStorage.setItem('username', username);
    }

    // Configura la redirección a las salas de chat al hacer clic en los enlaces
    document.querySelectorAll('a[href^="chat/"]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const roomId = link.getAttribute('href').split('/').pop();
            window.location.href = `/chat/${roomId}`;
        });
    });

    // Cerrar sesión
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('username');
        alert('You have logged out.');
        window.location.href = '/';
    });
});