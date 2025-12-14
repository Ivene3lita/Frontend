let books = [];
let genres = [];
let currentBookId = null;
let deleteBookId = null;

window.books = books;
window.genres = genres;
window.currentBookId = currentBookId;
window.deleteBookId = deleteBookId;

const addBookBtn = document.getElementById('addBookBtn');
const loadingIndicator = document.getElementById('loadingIndicator');

function setupCatalogue() {
    if (window.currentUser && window.currentUser.is_admin && addBookBtn) {
        addBookBtn.style.display = 'block';
    }
    
    loadBooks();
    loadGenres();
}

function setupEventListeners() {
    if (addBookBtn) {
        addBookBtn.addEventListener('click', () => openBookModal());
    }
    
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const bookForm = document.getElementById('bookForm');
    const searchInput = document.getElementById('searchInput');
    const genreFilter = document.getElementById('genreFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const bookModal = document.getElementById('bookModal');
    const confirmModal = document.getElementById('confirmModal');
    
    if (closeModal) {
        closeModal.addEventListener('click', () => closeBookModal());
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => closeBookModal());
    }
    
    if (bookForm) {
        bookForm.addEventListener('submit', handleFormSubmit);
    }
    
    const imageUrlInput = document.getElementById('image_url');
    if (imageUrlInput) {
        imageUrlInput.addEventListener('input', debounce(updateImagePreview, 500));
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(loadBooks, 300));
    }
    
    if (genreFilter) {
        genreFilter.addEventListener('change', loadBooks);
    }
    
    if (availabilityFilter) {
        availabilityFilter.addEventListener('change', loadBooks);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            if (confirmModal) confirmModal.classList.add('hidden');
            window.deleteBookId = null;
        });
    }
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }
    
    if (bookModal) {
        bookModal.addEventListener('click', (e) => {
            if (e.target === bookModal) closeBookModal();
        });
    }
    
    if (confirmModal) {
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) {
                confirmModal.classList.add('hidden');
                window.deleteBookId = null;
            }
        });
    }
}

async function handleBorrowBook(bookId) {
    try {
        showLoading(true);
        hideError();
        
        const result = await borrowBookAPI(bookId, window.authToken);
        
        if (result && result.error === 'unauthorized') {
            logout();
            return;
        }
        
        showLoading(false);
        const dueDate = new Date(result.borrowing.due_date).toLocaleDateString();
        showToast(`Due date: ${dueDate}`, 'success', 'Book borrowed successfully!');
        await loadBooks();
    } catch (error) {
        showLoading(false);
        showToast(error.message || 'Failed to borrow book. Please try again.', 'error', 'Error');
    }
}

window.borrowBook = handleBorrowBook;
window.editBook = editBook;
window.showDeleteConfirm = showDeleteConfirm;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.currentUser) {
            setupCatalogue();
            setupEventListeners();
        }
    }, 100);
});
