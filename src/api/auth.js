import axios from 'axios';
const API_URL = 'http://localhost:8000/api/';

export const login = async (email, motDePasse) => {
    const response = await axios.post(`${API_URL}login/`, { email, motDePasse });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data.user;
};

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
};


export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};