async function fetchBooks(search, genre, available) {
    const params = new URLSearchParams();
    
    if (search) {
        params.append('search', search);
    }
    if (genre) {
        params.append('genre', genre);
    }
    if (available) {
        params.append('available', available);
    }
    
    const url = `${API_BASE_URL}/books${params.toString() ? '?' + params.toString() : ''}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 401) {
                return { error: 'unauthorized' };
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
}

async function fetchBookById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/books/${id}`);
        if (!response.ok) {
            if (response.status === 401) {
                return { error: 'unauthorized' };
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching book:', error);
        throw error;
    }
}

async function createBook(bookData, authToken) {
    try {
        const response = await fetch(`${API_BASE_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(bookData),
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                return { error: 'unauthorized' };
            }
            const error = await response.json();
            throw new Error(error.error || 'Failed to create book');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating book:', error);
        throw error;
    }
}

async function updateBook(id, bookData, authToken) {
    try {
        const response = await fetch(`${API_BASE_URL}/books/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(bookData),
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                return { error: 'unauthorized' };
            }
            const error = await response.json();
            throw new Error(error.error || 'Failed to update book');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
}

async function deleteBook(id, authToken) {
    try {
        const response = await fetch(`${API_BASE_URL}/books/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                return { error: 'unauthorized' };
            }
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete book');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
}

async function fetchGenres() {
    try {
        const response = await fetch(`${API_BASE_URL}/books/meta/genres`);
        if (!response.ok) {
            if (response.status === 401) {
                return { error: 'unauthorized' };
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching genres:', error);
        throw error;
    }
}
