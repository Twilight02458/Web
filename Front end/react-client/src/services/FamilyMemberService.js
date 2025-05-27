import axios from 'axios';
import cookie from 'react-cookies';

const API_URL = 'http://localhost:8080/SpringMVC3/api';

// Create an axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Add a request interceptor to add the token to every request
api.interceptors.request.use(
    config => {
        const token = cookie.load('token');
        console.log('Token in request interceptor:', token);
        console.log('Cookie details:', {
            token: cookie.load('token'),
            allCookies: document.cookie
        });
        if (token) {
            // Set Authorization header with Bearer token
            config.headers.Authorization = `Bearer ${token}`;
            // Log the full request configuration for debugging
            console.log('Request config:', {
                url: config.url,
                method: config.method,
                headers: config.headers,
                fullHeaders: JSON.stringify(config.headers)
            });
        } else {
            console.warn('No token found in cookie');
            console.log('Available cookies:', document.cookie);
        }
        return config;
    },
    error => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
    response => response,
    error => {
        console.error('Response error:', error.response);
        if (error.response?.status === 401) {
            console.log('Received 401 error, checking token...');
            const token = cookie.load('token');
            if (!token) {
                console.log('No token found, redirecting to login');
                window.location.href = '/login';
            } else {
                console.log('Token exists but request failed, might be expired');
                // Check if the error response contains a message about token expiration
                const errorMessage = error.response.data?.message || '';
                if (errorMessage.toLowerCase().includes('expired') || errorMessage.toLowerCase().includes('invalid')) {
                    console.log('Token is expired or invalid, removing token and redirecting to login');
                    cookie.remove('token');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export const FamilyMemberService = {
    // Get all family members for a resident
    getFamilyMembersByResident: async (residentId) => {
        try {
            const response = await api.get(`/family-members/resident/${residentId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching family members:', error);
            throw error;
        }
    },

    // Get a specific family member by ID
    getFamilyMemberById: async (id) => {
        try {
            const response = await api.get(`/family-members/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching family member:', error);
            throw error;
        }
    },

    // Add a new family member
    addFamilyMember: async (familyMemberData) => {
        try {
            const response = await api.post('/family-members', familyMemberData);
            return response.data;
        } catch (error) {
            console.error('Error adding family member:', error);
            throw error;
        }
    },

    // Update a family member
    updateFamilyMember: async (id, familyMemberData) => {
        try {
            const response = await api.put(`/family-members/${id}`, familyMemberData);
            return response.data;
        } catch (error) {
            console.error('Error updating family member:', error);
            throw error;
        }
    },

    // Delete a family member
    deleteFamilyMember: async (id) => {
        try {
            await api.delete(`/family-members/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting family member:', error);
            throw error;
        }
    },

    // Get family member by card number
    getFamilyMemberByCardNumber: async (cardNumber) => {
        try {
            const response = await api.get(`/family-members/card/${cardNumber}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching family member by card number:', error);
            throw error;
        }
    }
}; 