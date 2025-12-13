async function loadBooks() {
    const searchInput = document.getElementById('searchInput');
    const genreFilter = document.getElementById('genreFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    
    showLoading(true);
    hideError();
    
    try {
        const search = searchInput.value.trim();
        const genre = genreFilter.value;
        const available = availabilityFilter.value;
        
        const result = await fetchBooks(search, genre, available);
        
        if (result && result.error === 'unauthorized') {
            logout();
            return;
        }
        
        if (Array.isArray(result)) {
            displayBooks(result, window.currentUser);
            window.books = result;
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        showToast('Failed to load books', 'error', 'Error');
    } finally {
        showLoading(false);
    }
}

async function loadGenres() {
    try {
        const result = await fetchGenres();
        if (result && result.error === 'unauthorized') {
            logout();
            return;
        }
        if (Array.isArray(result)) {
            window.genres = result;
            updateGenreFilter(result);
        }
    } catch (error) {
        console.error('Error loading genres:', error);
    }
}

function updateGenreFilter(genres) {
    const genreFilter = document.getElementById('genreFilter');
    genreFilter.innerHTML = '<option value="">All Genres</option>';
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
    
    const genreList = document.getElementById('genreList');
    if (genreList) {
        genreList.innerHTML = '';
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            genreList.appendChild(option);
        });
    }
}

async function loadBookForEdit(id) {
    showLoading(true);
    try {
        const book = await fetchBookById(id);
        if (book && book.error === 'unauthorized') {
            logout();
            return;
        }
        if (book) {
            document.getElementById('bookId').value = book.id;
            document.getElementById('title').value = book.title || '';
            document.getElementById('author').value = book.author || '';
            document.getElementById('isbn').value = book.isbn || '';
            document.getElementById('genre').value = book.genre || '';
            document.getElementById('publication_year').value = book.publication_year || '';
            document.getElementById('publisher').value = book.publisher || '';
            document.getElementById('description').value = book.description || '';
        }
    } finally {
        showLoading(false);
    }
}

function openBookModal(bookId = null) {
    window.currentBookId = bookId;
    const modalTitle = document.getElementById('modalTitle');
    const bookModal = document.getElementById('bookModal');
    
    if (bookId) {
        modalTitle.textContent = 'Edit Book';
        loadBookForEdit(bookId);
    } else {
        modalTitle.textContent = 'Add New Book';
        document.getElementById('bookForm').reset();
    }
    
    bookModal.classList.remove('hidden');
}

function closeBookModal() {
    const bookModal = document.getElementById('bookModal');
    bookModal.classList.add('hidden');
    document.getElementById('bookForm').reset();
    window.currentBookId = null;
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const bookData = {
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        isbn: document.getElementById('isbn').value.trim() || null,
        genre: document.getElementById('genre').value.trim() || null,
        publication_year: document.getElementById('publication_year').value ? parseInt(document.getElementById('publication_year').value) : null,
        publisher: document.getElementById('publisher').value.trim() || null,
        description: document.getElementById('description').value.trim() || null
    };
    
    if (!window.currentBookId) {
        bookData.available = true;
    }
    
    try {
        showLoading(true);
        hideError();
        
        let result;
        if (window.currentBookId) {
            result = await updateBook(window.currentBookId, bookData, window.authToken);
        } else {
            result = await createBook(bookData, window.authToken);
        }
        
        if (result && result.error === 'unauthorized') {
            logout();
            return;
        }
        
        closeBookModal();
        await loadBooks();
        await loadGenres();
        showLoading(false);
        showToast(window.currentBookId ? 'Book updated successfully!' : 'Book added successfully!', 'success', 'Success');
    } catch (error) {
        showLoading(false);
        showToast(error.message || 'Failed to save book. Please try again.', 'error', 'Error');
    }
}

function showDeleteConfirm(id) {
    window.deleteBookId = id;
    document.getElementById('confirmModal').classList.remove('hidden');
}

async function confirmDelete() {
    if (!window.deleteBookId) return;
    
    try {
        showLoading(true);
        hideError();
        const result = await deleteBook(window.deleteBookId, window.authToken);
        
        if (result && result.error === 'unauthorized') {
            logout();
            return;
        }
        
        document.getElementById('confirmModal').classList.add('hidden');
        window.deleteBookId = null;
        await loadBooks();
        await loadGenres();
        showLoading(false);
        showToast('Book deleted successfully!', 'success', 'Success');
    } catch (error) {
        showLoading(false);
        showToast(error.message || 'Failed to delete book. Please try again.', 'error', 'Error');
    }
}

function editBook(id) {
    openBookModal(id);
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('genreFilter').value = '';
    document.getElementById('availabilityFilter').value = '';
    loadBooks();
}
