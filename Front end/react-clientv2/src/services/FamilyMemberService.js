import api from '../axios';
import cookie from 'react-cookies';

const API_URL = '/api/secure/family-members';

// Add a request interceptor to add the token to every request
api.interceptors.request.use(
    config => {
        const token = cookie.load('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            const token = cookie.load('token');
            if (!token) {
                window.location.href = '/login';
            } else {
                const errorMessage = error.response.data?.message || '';
                if (errorMessage.toLowerCase().includes('expired') || errorMessage.toLowerCase().includes('invalid')) {
                    cookie.remove('token');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

const FamilyMemberService = {
    // Get all family members for a resident
    getFamilyMembersByResident: async (residentId) => {
        try {
            const response = await api.get(`${API_URL}/resident/${residentId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching family members:', error);
            throw error;
        }
    },

    // Get a specific family member by ID
    getFamilyMemberById: async (id) => {
        try {
            const response = await api.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching family member:', error);
            throw error;
        }
    },

    // Add a new family member
    addFamilyMember: async (familyMember) => {
        try {
            const response = await api.post(API_URL, familyMember);
            return response.data;
        } catch (error) {
            console.error('Error adding family member:', error);
            throw error;
        }
    },

    // Update a family member
    updateFamilyMember: async (id, familyMember) => {
        try {
            console.log('Updating family member:', id, familyMember);
            // Convert the family member object to a map of string values
            const params = {
                fullName: familyMember.fullName,
                phone: familyMember.phone,
                relationship: familyMember.relationship,
                status: familyMember.status,
                hasParkingCard: familyMember.hasParkingCard?.toString(),
                hasGateAccess: familyMember.hasGateAccess?.toString()
            };
            console.log('Sending update request with params:', params);
            const response = await api.put(`/api/secure/family-members/${id}`, params, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            console.log('Update response:', response);
            return response.data;
        } catch (error) {
            console.error('Error updating family member:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
            throw error;
        }
    },

    // Delete a family member
    deleteFamilyMember: async (id) => {
        try {
            const response = await api.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting family member:', error);
            throw error;
        }
    },

    // Get family member by card number
    getFamilyMemberByCardNumber: async (cardNumber) => {
        try {
            const response = await api.get(`${API_URL}/card/${cardNumber}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching family member by card number:', error);
            throw error;
        }
    }
};

export default FamilyMemberService; 