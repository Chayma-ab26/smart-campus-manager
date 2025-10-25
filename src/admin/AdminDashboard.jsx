// admin/AdminDashboard.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import { logout } from '../api/auth';

export default function AdminDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'ADMINISTRATEUR') {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div>
          <AdminHeader />

            <h1>Dashboard Administrateur</h1>
            <button onClick={() => { logout(); navigate('/login'); }}>Déconnexion</button>
        </div>
    );
}
