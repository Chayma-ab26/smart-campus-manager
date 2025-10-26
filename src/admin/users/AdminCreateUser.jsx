import React, { useState } from 'react';
import { adminCreateUser } from '../../api/auth';

import './user.css';
import AdminHeader from '../AdminHeader';

export default function AdminCreateUser({ onUserCreated }) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'ETUDIANT',
    // Champs spécifiques aux profils
    departement: '',
    grade: '',
    niveau: '',
    filiere: '',
    matricule: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Préparer les données selon le rôle
      const userData = {
        nom: formData.nom,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      // Ajouter les données de profil selon le rôle
      if (formData.role === 'ENSEIGNANT') {
        userData.enseignant_profile = {
          departement: formData.departement,
          grade: formData.grade
        };
      } else if (formData.role === 'ETUDIANT') {
        userData.etudiant_profile = {
          niveau: formData.niveau,
          filiere: formData.filiere,
          matricule: formData.matricule
        };
      }

      await adminCreateUser(userData);
      setMessage('✅ Utilisateur créé avec succès!');
      
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 'ETUDIANT',
        departement: '',
        grade: '',
        niveau: '',
        filiere: '',
        matricule: ''
      });

      // Notifier le parent
      if (onUserCreated) {
        onUserCreated();
      }

    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      setMessage('❌ Erreur lors de la création: ' + (error.response?.data?.detail || 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-create-user">
      <AdminHeader/>
      <h3>Créer un Nouvel Utilisateur</h3>
      
      <form onSubmit={handleSubmit} className="user-form">
        {/* Informations de base */}
        <div className="form-group">
          <label>Nom *</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Prénom</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label>Rôle *</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="ETUDIANT">Étudiant</option>
            <option value="ENSEIGNANT">Enseignant</option>
            <option value="ADMINISTRATEUR">Administrateur</option>
          </select>
        </div>

        {/* Champs spécifiques Enseignant */}
        {formData.role === 'ENSEIGNANT' && (
          <div className="profile-fields">
            <h4>Profil Enseignant</h4>
            <div className="form-group">
              <label>Département</label>
              <input
                type="text"
                name="departement"
                value={formData.departement}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Grade</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Champs spécifiques Étudiant */}
        {formData.role === 'ETUDIANT' && (
          <div className="profile-fields">
            <h4>Profil Étudiant</h4>
            <div className="form-group">
              <label>Niveau</label>
              <input
                type="text"
                name="niveau"
                value={formData.niveau}
                onChange={handleChange}
                placeholder="L1, L2, M1, etc."
              />
            </div>
            <div className="form-group">
              <label>Filière</label>
              <input
                type="text"
                name="filiere"
                value={formData.filiere}
                onChange={handleChange}
                placeholder="Informatique, Mathématiques, etc."
              />
            </div>
            <div className="form-group">
              <label>Matricule *</label>
              <input
                type="text"
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Création...' : 'Créer Utilisateur'}
        </button>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}