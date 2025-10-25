import React, { useState } from 'react';
import { login } from './auth';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Mot de passe" 
                    value={motDePasse} 
                    onChange={e => setMotDePasse(e.target.value)} 
                    required 
                />
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
}
