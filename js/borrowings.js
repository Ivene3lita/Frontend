async function borrowBookAPI(bookId, authToken) {
    try {
        const response = await fetch(`${API_BASE_URL}/borrowings/borrow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ book_id: bookId }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to borrow book');
        }
        
        return {
            success: true,
            borrowing: data.borrowing
        };
    } catch (error) {
        throw error;
    }
}

async function returnBookAPI(borrowingId, authToken) {
    try {
        const response = await fetch(`${API_BASE_URL}/borrowings/return/${borrowingId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to return book');
        }
        
        return {
            success: true,
            borrowing: data.borrowing
        };
    } catch (error) {
        throw error;
    }
}

async function fetchMyBooks(authToken) {
    try {
        const response = await fetch(`${API_BASE_URL}/borrowings/my-books`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                return { error: 'unauthorized' };
            }
            throw new Error('Failed to load borrowed books');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function fetchAllBorrowedBooks(authToken) {
    try {
        const response = await fetch(`${API_BASE_URL}/borrowings`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                return { error: 'unauthorized' };
            }
            if (response.status === 403) {
                return { error: 'forbidden' };
            }
            throw new Error('Failed to load all borrowed books');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}
