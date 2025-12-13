const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');

function checkExistingAuth() {
    const authToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (authToken && savedUser) {
        verifyToken(authToken).then(result => {
            if (result.success) {
                window.location.href = 'catalogue.html';
            } else {
                localStorage.removeItem('authToken');
                localStorage.removeItem('currentUser');
            }
        }).catch(() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
        });
    }
}

function setupAuthEventListeners() {
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        hideAuthError();
        hideRegisterError();
    });
    
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        hideAuthError();
        hideRegisterError();
    });
    
    loginFormElement.addEventListener('submit', handleLogin);
    registerFormElement.addEventListener('submit', handleRegister);
}

function hideAuthError() {
    const authErrorMessage = document.getElementById('authErrorMessage');
    if (authErrorMessage) {
        authErrorMessage.classList.add('hidden');
    }
}

function hideRegisterError() {
    const registerErrorMessage = document.getElementById('registerErrorMessage');
    if (registerErrorMessage) {
        registerErrorMessage.classList.add('hidden');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    hideAuthError();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showToast('Please enter both username and password', 'warning', 'Login Error');
        return;
    }
    
    try {
        const result = await loginUser(username, password);
        
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        
        showToast('Login successful!', 'success', 'Welcome back');
        
        setTimeout(() => {
            window.location.href = 'catalogue.html';
        }, 500);
        
    } catch (error) {
        showToast(error.message || 'Login failed. Please try again.', 'error', 'Login Error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    hideRegisterError();
    
    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const studentId = document.getElementById('regStudentId').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (!firstName || !lastName || !username || !email || !password) {
        showToast('Please fill in all required fields', 'warning', 'Registration Error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters long', 'warning', 'Registration Error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'warning', 'Registration Error');
        return;
    }
    
    try {
        const result = await registerUser({
            first_name: firstName,
            last_name: lastName,
            username,
            email,
            student_id: studentId || null,
            phone: phone || null,
            password,
        });
        
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        
        showToast('Account created successfully!', 'success', 'Welcome!');
        
        setTimeout(() => {
            window.location.href = 'catalogue.html';
        }, 500);
        
    } catch (error) {
        showToast(error.message || 'Registration failed. Please try again.', 'error', 'Registration Error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkExistingAuth();
    setupAuthEventListeners();
});
