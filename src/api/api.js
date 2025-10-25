import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const login = async (email, motDePasse) => {
    const response = await axios.post(`${API_URL}login/`, { email, motDePasse });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    localStorage.setItem('user_role', response.data.user.role);
    return response.data.user;
};

export const getUsers = async () => {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${API_URL}users/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
