import axios from 'axios';
const API_URL = 'http://localhost:8000/api/';

export const login = async (email, motDePasse) => {
    const response = await axios.post(`${API_URL}login/`, { email, password: motDePasse });
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

export const adminGetUsers = async () => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get(`${API_URL}users/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const adminCreateUser = async (userData) => {
  const token = localStorage.getItem('access_token');
  const response = await axios.post(`${API_URL}users/`, userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const adminDeleteUser = async (userId) => {
  const token = localStorage.getItem('access_token');
  const response = await axios.delete(`${API_URL}users/${userId}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
