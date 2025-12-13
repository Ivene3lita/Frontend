let currentUser = null;
let authToken = null;

window.currentUser = currentUser;
window.authToken = authToken;

function checkAuthentication() {
    authToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    window.authToken = authToken;
    
    if (authToken && savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            window.currentUser = currentUser;
            verifyToken(authToken).then(result => {
                if (result.success) {
                    currentUser = result.user;
                    window.currentUser = currentUser;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    setupNavigation();
                } else {
                    redirectToLogin();
                }
            }).catch(() => {
                redirectToLogin();
            });
        } catch (error) {
            console.error('Error parsing user data:', error);
            redirectToLogin();
        }
    } else {
        redirectToLogin();
    }
}

function redirectToLogin() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function setupNavigation() {
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    const myBooksNav = document.getElementById('myBooksNav');
    const adminBorrowedNav = document.getElementById('adminBorrowedNav');
    
    if (currentUser && userName) {
        userName.textContent = currentUser.username || currentUser.first_name || 'User';
    }
    
    if (currentUser) {
        if (currentUser.is_admin) {
            if (adminBorrowedNav) adminBorrowedNav.style.display = 'inline-block';
            if (myBooksNav) myBooksNav.style.display = 'none';
        } else {
            if (myBooksNav) myBooksNav.style.display = 'inline-block';
            if (adminBorrowedNav) adminBorrowedNav.style.display = 'none';
        }
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    window.authToken = null;
    window.currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    redirectToLogin();
}

window.logout = logout;

document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});
