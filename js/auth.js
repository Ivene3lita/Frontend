async function verifyToken(authToken) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return { success: true, user: data.user };
        } else {
            return { success: false };
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        return { success: false };
    }
}

async function loginUser(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        return {
            success: true,
            token: data.token,
            user: data.user
        };
    } catch (error) {
        throw error;
    }
}

async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        
        return {
            success: true,
            token: data.token,
            user: data.user
        };
    } catch (error) {
        throw error;
    }
}
