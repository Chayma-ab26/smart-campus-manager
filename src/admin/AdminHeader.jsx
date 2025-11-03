import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';

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
                <Link to="/admin/users" style={styles.link}>Utilisateurs</Link>
                <Link to="/admin/events" style={styles.link}>Événements</Link>
                <Link to="/admin/salles" style={styles.link}>Salles</Link>
                <Link to="/admin/classes" style={styles.link}>Classes</Link>
                <Link to="/admin/matieres" style={styles.link}>Matières</Link>

            </nav>
            <button onClick={handleLogout} style={styles.logoutBtn}>Déconnexion</button>
        </header>
    );
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 40px',
        backgroundColor: '#0F172A',
        color: '#F8FAFC',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        letterSpacing: '1px',
    },
    nav: {
        display: 'flex',
        gap: '25px',
    },
    link: {
        color: '#F8FAFC',
        textDecoration: 'none',
        fontWeight: '500',
        padding: '8px 15px',
        borderRadius: '8px',
        transition: '0.3s',
    },
    logoutBtn: {
        backgroundColor: '#EF4444',
        color: 'white',
        border: 'none',
        padding: '8px 20px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: '0.3s',
    },
};
