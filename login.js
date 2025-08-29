document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    const correctUsername = 'barekat1403';
    const correctPassword = '1231kjh4kljh12k4jh124lkjh';
    
    if (username === correctUsername && password === correctPassword) {
        sessionStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'viewer.html';
    } else {
        errorMessage.textContent = 'نام کاربری یا رمز عبور اشتباه است';
        errorMessage.style.display = 'block';
        
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
});