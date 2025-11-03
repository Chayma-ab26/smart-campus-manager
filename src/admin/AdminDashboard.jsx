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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <AdminHeader />

            <h1 style={styles.title}>Bienvenue sur le Dashboard Administrateur</h1>

            {/* Statistiques rapides */}
            <div style={styles.statsContainer}>
                <div style={{ ...styles.statCard, borderTop: '5px solid #0EA5E9' }}>
                    <h3>120</h3>
                    <p>Utilisateurs</p>
                </div>
                <div style={{ ...styles.statCard, borderTop: '5px solid #22C55E' }}>
                    <h3>45</h3>
                    <p>Événements</p>
                </div>
                <div style={{ ...styles.statCard, borderTop: '5px solid #F59E0B' }}>
                    <h3>12</h3>
                    <p>Salles</p>
                </div>
                <div style={{ ...styles.statCard, borderTop: '5px solid #EF4444' }}>
                    <h3>78</h3>
                    <p>Réservations</p>
                </div>
                <div style={{ ...styles.statCard, borderTop: '5px solid #f48fe0ff' }}>
                    <h3>78</h3>
                    <p>Matieres</p>
                </div>


            </div>

            {/* Cartes interactives */}
            <div style={styles.cardsContainer}>
                {[
                    { title: 'Utilisateurs', desc: 'Gérer tous les utilisateurs', path: '/admin/users', color: '#0EA5E9' },
                    { title: 'Événements', desc: 'Créer, modifier, supprimer', path: '/admin/events', color: '#22C55E' },
                    { title: 'Salles', desc: 'Gérer les salles disponibles', path: '/admin/salles', color: '#F59E0B' },
                    { title: 'Classes', desc: 'Voir et gérer tous les classes', path: '/admin/classes', color: '#EF4444' },
                    { title: 'Matières', desc: 'Voir et gérer toutes les matières', path: '/admin/matieres', color: '#8B5CF6' },
                ].map((card) => (
                    <div
                        key={card.title}
                        style={{ ...styles.card, borderLeft: `5px solid ${card.color}` }}
                        onClick={() => navigate(card.path)}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <h2>{card.title}</h2>
                        <p>{card.desc}</p>
                        <button style={{ ...styles.cardBtn, backgroundColor: card.color }}>Voir</button>
                    </div>
                ))}
            </div>

        </div>
    );
}

const styles = {
    container: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#F8FAFC',
        minHeight: '100vh',
        padding: '20px 40px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        margin: '20px 0',
        color: '#1E293B',
    },
    statsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
    },
    statCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        textAlign: 'center',
        transition: '0.3s',
    },
    cardsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
    },
    card: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    cardBtn: {
        marginTop: '15px',
        padding: '10px 15px',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: '0.3s',
    },
    logoutBtn: {
        padding: '12px 24px',
        backgroundColor: '#EF4444',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '600',
        display: 'block',
        margin: '0 auto',
        transition: '0.3s',
    },
};
