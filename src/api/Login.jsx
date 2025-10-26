import React, { useState } from 'react';
import { login } from './auth';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaLock } from 'react-icons/fa';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, motDePasse);

            // Redirection selon le rôle après connexion
            if (user.role === 'ADMINISTRATEUR') navigate('/admin/dashboard');
            else if (user.role === 'ENSEIGNANT') navigate('/enseignant/dashboard');
            else if (user.role === 'ETUDIANT') navigate('/etudiant/dashboard');

        } catch (error) {
            console.error(error);
            alert('Email ou mot de passe incorrect');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* 🔙 Bouton retour */}
                <Link to="/" className="back-home">
                    <FaArrowLeft /> Retour à l'accueil
                </Link>

                <h2>Bienvenue </h2>
                <p className="subtitle">Connectez-vous à votre espace SmartCampus</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <FaEnvelope className="icon" />
                        <input
                            type="email"
                            placeholder="Adresse e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="input-group">
                        <FaLock className="icon" />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={motDePasse}
                            onChange={(e) => setMotDePasse(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit" className="login-btn">Se connecter</button>
                </form>

               
            </div>
        </div>
    );
}
