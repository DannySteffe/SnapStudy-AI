const API_URL = 'http://127.0.0.1:3001/api';

const getHeaders = (isFormData = false) => {
    const userInfo = localStorage.getItem('userInfo');
    const token = userInfo ? JSON.parse(userInfo).token : null;

    const headers = {};
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// Generic error handler
const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = 'An error occurred';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        } catch (e) {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        // If unauthorized, clear stored user data
        if (response.status === 401) {
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
        }
        
        throw new Error(errorMessage);
    }
    return response.json();
};

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
};

export const registerUser = async (name, email, password) => {
    const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
};

export const getUserProfile = async () => {
    const response = await fetch(`${API_URL}/users/profile`, {
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const getModules = async () => {
    const response = await fetch(`${API_URL}/modules`, {
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const getModule = async (id) => {
    const response = await fetch(`${API_URL}/modules/${id}`, {
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const createModule = async (moduleData) => {
    const isFormData = moduleData instanceof FormData;
    const headers = getHeaders(isFormData);
    const body = isFormData ? moduleData : JSON.stringify(moduleData);

    const response = await fetch(`${API_URL}/modules`, {
        method: 'POST',
        headers,
        body,
    });
    return handleResponse(response);
};

export const deleteModule = async (id) => {
    const response = await fetch(`${API_URL}/modules/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    return handleResponse(response);
};
