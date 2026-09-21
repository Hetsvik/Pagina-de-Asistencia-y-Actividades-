document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('error-msg');

    // Si ya está logueado, redirigir a inicio automáticamente
    if(localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'inicio.html';
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const perfilSeleccionado = document.getElementById('perfilAcceso').value; // 'admin' o 'empleado'
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (username !== "" && password !== "") {
            // Guardamos la sesión y el rol temporalmente para el diseño
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('userRole', perfilSeleccionado); // <-- Aquí se guarda 'admin' o 'empleado'

            // Redirigir a la vista de inicio
            window.location.href = 'inicio.html';
        } else {
            if(errorMsg) errorMsg.classList.remove('hidden');
        }
    });
});