const loadingMyBooks = document.getElementById('loadingMyBooks');

async function loadMyBooks() {
    try {
        if (loadingMyBooks) loadingMyBooks.classList.remove('hidden');
        hideMyBooksError();
        
        const result = await fetchMyBooks(window.authToken);
        
        if (result && result.error === 'unauthorized') {
            logout();
            return;
        }
        
        if (Array.isArray(result)) {
            displayMyBooks(result);
        }
        
        if (loadingMyBooks) loadingMyBooks.classList.add('hidden');
    } catch (error) {
        if (loadingMyBooks) loadingMyBooks.classList.add('hidden');
        showToast(error.message || 'Failed to load borrowed books.', 'error', 'Error');
    }
}

async function handleReturnBook(borrowingId) {
    try {
        if (loadingMyBooks) loadingMyBooks.classList.remove('hidden');
        hideMyBooksError();
        
        const result = await returnBookAPI(borrowingId, window.authToken);
        
        if (result && result.error === 'unauthorized') {
            logout();
            return;
        }
        
        if (loadingMyBooks) loadingMyBooks.classList.add('hidden');
        showToast('Book returned successfully!', 'success', 'Success');
        await loadMyBooks();
    } catch (error) {
        if (loadingMyBooks) loadingMyBooks.classList.add('hidden');
        showToast(error.message || 'Failed to return book. Please try again.', 'error', 'Error');
    }
}

window.handleReturnBook = handleReturnBook;

function checkUserRole() {
    if (window.currentUser && window.currentUser.is_admin) {
        window.location.href = 'catalogue.html';
        return;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.currentUser) {
            checkUserRole();
            loadMyBooks();
        }
    }, 100);
});
