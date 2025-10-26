import React, { useState, useEffect } from 'react';
import { adminGetUsers, adminDeleteUser } from '../../api/auth';
import AdminHeader from '../AdminHeader';
import './user.css';

export default function AdminUsersList({ refresh }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await adminGetUsers();
      setUsers(usersData);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [refresh]);

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?`)) {
      try {
        await adminDeleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        alert('Utilisateur supprimé avec succès');
      } catch (err) {
        alert('Erreur lors de la suppression');
        console.error('Erreur:', err);
      }
    }
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      ADMINISTRATEUR: 'badge-admin',
      ENSEIGNANT: 'badge-teacher',
      ETUDIANT: 'badge-student'
    };
    return <span className={`role-badge ${roleColors[role]}`}>{role}</span>;
  };

  if (loading) return <div className="loading">Chargement des utilisateurs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    
    <div className="admin-users-list">
      <AdminHeader />
      <h3>Liste des Utilisateurs ({users.length})</h3>
      
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Profil</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nom}</td>
                <td>{user.email}</td>
                <td>{getRoleBadge(user.role)}</td>
                <td>
                  {user.role === 'ENSEIGNANT' && user.enseignant_profile && (
                    <div className="profile-info">
                      <small>Dépt: {user.enseignant_profile.departement}</small>
                      <small>Grade: {user.enseignant_profile.grade}</small>
                    </div>
                  )}
                  {user.role === 'ETUDIANT' && user.etudiant_profile && (
                    <div className="profile-info">
                      <small>Niv: {user.etudiant_profile.niveau}</small>
                      <small>Fil: {user.etudiant_profile.filiere}</small>
                    </div>
                  )}
                </td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteUser(user.id, user.nom)}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="no-users">
            Aucun utilisateur trouvé
          </div>
        )}
      </div>
    </div>
  );
}