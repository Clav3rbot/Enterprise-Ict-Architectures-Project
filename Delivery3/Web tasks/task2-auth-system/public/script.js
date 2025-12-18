function showSignup() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
    hideMessage();
}

function showLogin() {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    hideMessage();
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = type;
}

function hideMessage() {
    const messageDiv = document.getElementById('message');
    messageDiv.className = '';
    messageDiv.textContent = '';
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Login successful!', 'success');
            document.getElementById('loginForm').reset();
        } else {
            showMessage(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showMessage('Server connection error', 'error');
    }
});

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value.trim();
    const surname = document.getElementById('signup-surname').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    
    // Client-side validation
    const nameRegex = /^[a-zA-Z\s]+$/;
    
    if (!name || name.length < 2) {
        showMessage('First name must be at least 2 characters long', 'error');
        return;
    }
    
    if (!nameRegex.test(name)) {
        showMessage('First name must contain only letters', 'error');
        return;
    }
    
    if (!surname || surname.length < 2) {
        showMessage('Last name must be at least 2 characters long', 'error');
        return;
    }
    
    if (!nameRegex.test(surname)) {
        showMessage('Last name must contain only letters', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, surname, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Account created successfully!', 'success');
            document.getElementById('signupForm').reset();
            setTimeout(showLogin, 2000);
        } else {
            showMessage(data.message || 'Signup failed', 'error');
        }
    } catch (error) {
        showMessage('Server connection error', 'error');
    }
});
