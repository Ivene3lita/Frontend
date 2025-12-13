function showLoading(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (show) {
        loadingIndicator.classList.remove('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
    }
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    showToast(message, 'error', 'Error');
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.classList.add('hidden');
}

function showAuthError(message) {
    const authErrorMessage = document.getElementById('authErrorMessage');
    showToast(message, 'error', 'Login Error');
    authErrorMessage.textContent = message;
    authErrorMessage.classList.remove('hidden');
}

function hideAuthError() {
    const authErrorMessage = document.getElementById('authErrorMessage');
    authErrorMessage.classList.add('hidden');
}

function showRegisterError(message) {
    const registerErrorMessage = document.getElementById('registerErrorMessage');
    showToast(message, 'error', 'Registration Error');
    registerErrorMessage.textContent = message;
    registerErrorMessage.classList.remove('hidden');
}

function hideRegisterError() {
    const registerErrorMessage = document.getElementById('registerErrorMessage');
    registerErrorMessage.classList.add('hidden');
}

function showMyBooksError(message) {
    const myBooksError = document.getElementById('myBooksError');
    showToast(message, 'error', 'Error');
    myBooksError.textContent = message;
    myBooksError.classList.remove('hidden');
}

function hideMyBooksError() {
    const myBooksError = document.getElementById('myBooksError');
    myBooksError.classList.add('hidden');
}

function displayBooks(booksToDisplay, currentUser) {
    const booksGrid = document.getElementById('booksGrid');
    
    if (booksToDisplay.length === 0) {
        booksGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <h2>No books found</h2>
                <p>Try adjusting your search or add a new book to get started.</p>
            </div>
        `;
        return;
    }
    
    const isAdmin = currentUser && currentUser.is_admin;
    
    booksGrid.innerHTML = booksToDisplay.map(book => `
        <div class="book-card ${book.available ? 'available' : 'unavailable'}">
            <h3 class="book-title">${escapeHtml(book.title)}</h3>
            <p class="book-author">by ${escapeHtml(book.author)}</p>
            
            <div class="book-details">
                ${book.isbn ? `<div class="book-detail-item"><strong>ISBN:</strong> ${escapeHtml(book.isbn)}</div>` : ''}
                ${book.genre ? `<div class="book-detail-item"><strong>Genre:</strong> ${escapeHtml(book.genre)}</div>` : ''}
                ${book.publication_year ? `<div class="book-detail-item"><strong>Year:</strong> ${book.publication_year}</div>` : ''}
                ${book.publisher ? `<div class="book-detail-item"><strong>Publisher:</strong> ${escapeHtml(book.publisher)}</div>` : ''}
            </div>
            
            ${book.description ? `<div class="book-description">${escapeHtml(book.description)}</div>` : ''}
            
            <span class="availability-badge ${book.available ? 'available' : 'unavailable'}">
                ${book.available ? '✓ Available' : '✗ Unavailable'}
            </span>
            
            <div class="book-actions">
                ${isAdmin ? `
                    <button class="btn btn-edit" onclick="editBook(${book.id})">Edit</button>
                    <button class="btn btn-delete" onclick="showDeleteConfirm(${book.id})">Delete</button>
                ` : ''}
                ${!isAdmin && book.available ? `
                    <button class="btn btn-primary" onclick="borrowBook(${book.id})">Borrow</button>
                ` : ''}
                ${!isAdmin && !book.available ? `
                    <button class="btn btn-secondary" disabled>Not Available</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function displayMyBooks(borrowings) {
    const myBooksList = document.getElementById('myBooksList');
    
    if (borrowings.length === 0) {
        myBooksList.innerHTML = `
            <div class="empty-state">
                <h2>No borrowed books</h2>
                <p>You haven't borrowed any books yet. Browse the catalogue to find books to borrow.</p>
            </div>
        `;
        return;
    }
    
    myBooksList.innerHTML = borrowings.map(borrowing => {
        const dueDate = new Date(borrowing.due_date);
        const isOverdue = borrowing.status === 'borrowed' && dueDate < new Date();
        const isReturned = borrowing.status === 'returned';
        
        return `
            <div class="borrowed-book-card ${isOverdue ? 'overdue' : ''} ${isReturned ? 'returned' : ''}">
                <div class="borrowed-book-info">
                    <h3 class="borrowed-book-title">${escapeHtml(borrowing.title)}</h3>
                    <p class="borrowed-book-author">by ${escapeHtml(borrowing.author)}</p>
                    <div class="borrowed-book-details">
                        ${borrowing.isbn ? `<div><strong>ISBN:</strong> ${escapeHtml(borrowing.isbn)}</div>` : ''}
                        ${borrowing.genre ? `<div><strong>Genre:</strong> ${escapeHtml(borrowing.genre)}</div>` : ''}
                        <div><strong>Borrowed:</strong> ${new Date(borrowing.borrowed_date).toLocaleDateString()}</div>
                        <div><strong>Due Date:</strong> <span class="${isOverdue ? 'overdue-text' : ''}">${dueDate.toLocaleDateString()}</span></div>
                        ${borrowing.returned_date ? `<div><strong>Returned:</strong> ${new Date(borrowing.returned_date).toLocaleDateString()}</div>` : ''}
                    </div>
                    <span class="status-badge ${borrowing.status}">
                        ${borrowing.status === 'borrowed' ? (isOverdue ? '⚠ Overdue' : '📖 Borrowed') : ''}
                        ${borrowing.status === 'returned' ? '✓ Returned' : ''}
                        ${borrowing.status === 'overdue' ? '⚠ Overdue' : ''}
                    </span>
                </div>
                ${!isReturned ? `
                    <button class="btn btn-primary" onclick="handleReturnBook(${borrowing.borrowing_id})">Return Book</button>
                ` : ''}
            </div>
        `;
    }).join('');
}

function displayAllBorrowedBooks(borrowings) {
    const borrowedBooksList = document.getElementById('borrowedBooksList');
    
    if (borrowings.length === 0) {
        borrowedBooksList.innerHTML = `
            <div class="empty-state">
                <h2>No borrowed books</h2>
                <p>No books have been borrowed yet.</p>
            </div>
        `;
        return;
    }
    
    borrowedBooksList.innerHTML = borrowings.map(borrowing => {
        const dueDate = new Date(borrowing.due_date);
        const isOverdue = borrowing.status === 'borrowed' && dueDate < new Date();
        const isReturned = borrowing.status === 'returned';
        
        return `
            <div class="borrowed-book-admin-card ${isOverdue ? 'overdue' : ''} ${isReturned ? 'returned' : ''}">
                <div class="borrowed-book-admin-info">
                    <div class="book-info-section">
                        <h3 class="borrowed-book-title">${escapeHtml(borrowing.title)}</h3>
                        <p class="borrowed-book-author">by ${escapeHtml(borrowing.author)}</p>
                        ${borrowing.isbn ? `<p class="book-isbn"><strong>ISBN:</strong> ${escapeHtml(borrowing.isbn)}</p>` : ''}
                    </div>
                    
                    <div class="user-info-section">
                        <h4 class="user-name">${escapeHtml(borrowing.first_name)} ${escapeHtml(borrowing.last_name)}</h4>
                        <p class="user-details">
                            ${borrowing.student_id ? `<strong>Student ID:</strong> ${escapeHtml(borrowing.student_id)}<br>` : ''}
                        </p>
                    </div>
                    
                    <div class="date-info-section">
                        <div class="date-item">
                            <strong>Borrowed:</strong> ${new Date(borrowing.borrowed_date).toLocaleDateString()}
                        </div>
                        <div class="date-item ${isOverdue ? 'overdue-text' : ''}">
                            <strong>Due Date:</strong> ${dueDate.toLocaleDateString()}
                        </div>
                        ${borrowing.returned_date ? `
                            <div class="date-item">
                                <strong>Returned:</strong> ${new Date(borrowing.returned_date).toLocaleDateString()}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="status-section">
                        <span class="status-badge ${borrowing.status}">
                            ${borrowing.status === 'borrowed' ? (isOverdue ? '⚠ Overdue' : '📖 Borrowed') : ''}
                            ${borrowing.status === 'returned' ? '✓ Returned' : ''}
                            ${borrowing.status === 'overdue' ? '⚠ Overdue' : ''}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
