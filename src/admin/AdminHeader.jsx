import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth'; // on remonte d’un dossier pour accéder à auth.js

export default function AdminHeader() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header style={styles.header}>
            <div style={styles.logo}>🎓 Admin Dashboard</div>

            <nav style={styles.nav}>
                <Link to="/admin/users" style={styles.link}>👥 Utilisateurs</Link>
                <Link to="/admin/events" style={styles.link}>🎉 Événements</Link>
                <Link to="/admin/salles" style={styles.link}>🏛️ Salles</Link>
                <Link to="/admin/reservations" style={styles.link}>📅 Réservations</Link>
            </nav>

            <button onClick={handleLogout} style={styles.logoutBtn}>Se déconnecter</button>
        </header>
    );
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        color: 'white',
        padding: '10px 20px',
        borderBottom: '3px solid #0EA5E9',
    },
    logo: {
        fontSize: '20px',
        fontWeight: 'bold',
    },
    nav: {
        display: 'flex',
        gap: '20px',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        fontWeight: '500',
    },
    logoutBtn: {
        backgroundColor: '#EF4444',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};
