const loadingBorrowedBooks = document.getElementById('loadingBorrowedBooks');

async function loadAllBorrowedBooks() {
    try {
        if (loadingBorrowedBooks) loadingBorrowedBooks.classList.remove('hidden');
        hideBorrowedBooksError();
        
        const result = await fetchAllBorrowedBooks(window.authToken);
        
        if (result && result.error === 'unauthorized') {
            logout();
            return;
        }
        
        if (result && result.error === 'forbidden') {
            showToast('Admin access required', 'error', 'Error');
            window.location.href = 'catalogue.html';
            return;
        }
        
        if (Array.isArray(result)) {
            displayAllBorrowedBooks(result);
        }
        
        if (loadingBorrowedBooks) loadingBorrowedBooks.classList.add('hidden');
    } catch (error) {
        if (loadingBorrowedBooks) loadingBorrowedBooks.classList.add('hidden');
        showToast(error.message || 'Failed to load borrowed books.', 'error', 'Error');
    }
}

function hideBorrowedBooksError() {
    const borrowedBooksError = document.getElementById('borrowedBooksError');
    if (borrowedBooksError) {
        borrowedBooksError.classList.add('hidden');
    }
}

function showBorrowedBooksError(message) {
    const borrowedBooksError = document.getElementById('borrowedBooksError');
    if (borrowedBooksError) {
        showToast(message, 'error', 'Error');
        borrowedBooksError.textContent = message;
        borrowedBooksError.classList.remove('hidden');
    }
}

function checkUserRole() {
    if (!window.currentUser || !window.currentUser.is_admin) {
        window.location.href = 'catalogue.html';
        return;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.currentUser) {
            checkUserRole();
            loadAllBorrowedBooks();
        }
    }, 100);
});
