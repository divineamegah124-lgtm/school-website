// Admin Login form submission (placeholder - backend connection comes later)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const loginStatus = document.getElementById('loginStatus');
    loginStatus.textContent = 'Login functionality pending backend connection.';
    loginStatus.style.color = '#14532d';
  });
}