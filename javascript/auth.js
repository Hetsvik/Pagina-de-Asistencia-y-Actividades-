document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('error-msg');

    // Si ya está logueado, redirigir a inicio
    if(localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'html/inicio.html';
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simulación de validación (Reemplazo del backend)
        if (username === 'admin' && password === '1234') {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            window.location.href = 'html/inicio.html';
        } else {
            errorMsg.classList.remove('hidden');
        }
    });
});