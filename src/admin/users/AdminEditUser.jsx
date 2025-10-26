import React, { useState, useEffect } from 'react';
import { adminUpdateUser, adminGetUsers } from '../../api/auth';
import AdminHeader from '../AdminHeader';
import './user.css';

export default function AdminEditUser({ userId, onUserUpdated, onCancel }) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'ETUDIANT',
    departement: '',
    grade: '',
    niveau: '',
    filiere: '',
    matricule: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setInitialLoading(true);
      const users = await adminGetUsers();
      const user = users.find(u => u.id === userId);

      if (user) {
        setFormData({
          nom: user.nom || '',
          prenom: user.prenom || '',
          email: user.email || '',
          role: user.role || 'ETUDIANT',
          departement: user.departement || '',
          grade: user.grade || '',
          niveau: user.niveau || '',
          filiere: user.filiere || '',
          matricule: user.matricule || ''
        });
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
      setMessage('❌ Erreur lors du chargement des données utilisateur');
    } finally {
      setInitialLoading(false);
    }
  };

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
        prenom: formData.prenom,
        email: formData.email,
        role: formData.role
      };

      // Ajouter les données de profil selon le rôle
      if (formData.role === 'ENSEIGNANT') {
        userData.departement = formData.departement;
        userData.grade = formData.grade;
      } else if (formData.role === 'ETUDIANT') {
        userData.niveau = formData.niveau;
        userData.filiere = formData.filiere;
        userData.matricule = formData.matricule;
      }

      await adminUpdateUser(userId, userData);
      setMessage('✅ Utilisateur modifié avec succès!');

      // Notifier le parent
      if (onUserUpdated) {
        onUserUpdated();
      }

    } catch (error) {
      console.error('Erreur modification utilisateur:', error);
      setMessage('❌ Erreur lors de la modification: ' + (error.response?.data?.detail || 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="admin-edit-user">
        <AdminHeader />
        <div className="loading">Chargement des données utilisateur...</div>
      </div>
    );
  }

  return (
    <div className="admin-edit-user">
      <AdminHeader />
      <h3>Modifier l'Utilisateur</h3>

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
            autoComplete="username"
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

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Modification...' : 'Modifier Utilisateur'}
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Annuler
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
