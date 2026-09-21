document.addEventListener('DOMContentLoaded', () => {
    // Validar seguridad (que no entren sin login)
    if(localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = '../index.html';
    }

    // Mostrar nombre del usuario
    const userNameDisplay = document.getElementById('userNameDisplay');
    if(userNameDisplay) {
        userNameDisplay.textContent = localStorage.getItem('username') || 'Usuario';
    }

    // Lógica para cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            window.location.href = '../index.html';
        });
    }
});