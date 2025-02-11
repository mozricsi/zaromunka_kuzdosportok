document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const loginForm = document.getElementById('loginForm');

    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            localStorage.setItem('role', role);

            alert('Sikeres regisztráció!');
            window.location.href = 'login.html';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const storedUsername = localStorage.getItem('username');
            const storedPassword = localStorage.getItem('password');
            const role = localStorage.getItem('role');

            if (username === storedUsername && password === storedPassword) {
                alert('Sikeres bejelentkezés!');
                if (role === 'coach') {
                    window.location.href = 'coach-dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                alert('Hibás felhasználónév vagy jelszó!');
            }
        });
    }
});