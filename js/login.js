const loginMatch = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginMatch.addEventListener('submit',(e) =>{
    e.preventDefault();

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    errorMessage.textContent = '';

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        sessionStorage.setItem('currentUser', email);
        window.location.href = 'profiles.html';
    } else {
        errorMessage.textContent = 'Email or Password are incorrect'
    }
}) 