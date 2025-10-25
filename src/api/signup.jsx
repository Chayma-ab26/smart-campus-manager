import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export default function Signup() {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [role, setRole] = useState('ETUDIANT');  // Valeur par défaut

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}signup/`, { nom, email, motDePasse, role });
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert('Erreur lors de l’inscription');
        }
    };

    return (
        <div>
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Mot de passe" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} required />
                <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="ADMINISTRATEUR">Administrateur</option>
                    <option value="ENSEIGNANT">Enseignant</option>
                    <option value="ETUDIANT">Étudiant</option>
                </select>
                <button type="submit">S’inscrire</button>
            </form>
        </div>
    );
}
