import axios from '../axios';

const API_URL = '/api/complaints';

export const complaintService = {
    createComplaint: async (complaint) => {
        const response = await axios.post(API_URL, complaint);
        return response.data;
    },

    updateComplaint: async (id, complaint) => {
        const response = await axios.put(`${API_URL}/${id}`, complaint);
        return response.data;
    },

    deleteComplaint: async (id) => {
        await axios.delete(`${API_URL}/${id}`);
    },

    getComplaintById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    getAllComplaints: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getComplaintsByUser: async (userId) => {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        return response.data;
    },

    getComplaintsByStatus: async (status) => {
        const response = await axios.get(`${API_URL}/status/${status}`);
        return response.data;
    },

    getComplaintsByUserAndStatus: async (userId, status) => {
        const response = await axios.get(`${API_URL}/user/${userId}/status/${status}`);
        return response.data;
    }
}; 