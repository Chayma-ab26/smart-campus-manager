import React, { useState, useEffect } from 'react';
import { adminGetUsers, adminDeleteUser, adminCreateUser, adminUpdateUser } from '../../api/auth';
import AdminHeader from '../AdminHeader';
import Swal from 'sweetalert2';
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
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous supprimer l'utilisateur "${userName}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await adminDeleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        Swal.fire('Supprimé!', 'L\'utilisateur a été supprimé.', 'success');
      } catch (err) {
        Swal.fire('Erreur', 'Erreur lors de la suppression', 'error');
        console.error('Erreur:', err);
      }
    }
  };

  const handleCreateUser = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Créer un Nouvel Utilisateur',
      html:
        '<input id="swal-nom" class="swal2-input" placeholder="Nom *" required>' +
        '<input id="swal-prenom" class="swal2-input" placeholder="Prénom">' +
        '<input id="swal-email" class="swal2-input" placeholder="Email *" type="email" required>' +
        '<input id="swal-password" class="swal2-input" placeholder="Mot de passe *" type="password" required>' +
        '<select id="swal-role" class="swal2-input">' +
          '<option value="ETUDIANT">Étudiant</option>' +
          '<option value="ENSEIGNANT">Enseignant</option>' +
          '<option value="ADMINISTRATEUR">Administrateur</option>' +
        '</select>' +
        '<div id="profile-fields"></div>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Créer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const nom = document.getElementById('swal-nom').value;
        const prenom = document.getElementById('swal-prenom').value;
        const email = document.getElementById('swal-email').value;
        const password = document.getElementById('swal-password').value;
        const role = document.getElementById('swal-role').value;

        if (!nom || !email || !password) {
          Swal.showValidationMessage('Veuillez remplir tous les champs obligatoires');
          return false;
        }

        let userData = { nom, prenom, email, password, role };

        if (role === 'ENSEIGNANT') {
          const departement = document.getElementById('swal-departement')?.value || '';
          const grade = document.getElementById('swal-grade')?.value || '';
          userData = { ...userData, departement, grade };
        } else if (role === 'ETUDIANT') {
          const niveau = document.getElementById('swal-niveau')?.value || '';
          const filiere = document.getElementById('swal-filiere')?.value || '';
          const matricule = document.getElementById('swal-matricule')?.value || '';
          userData = { ...userData, niveau, filiere, matricule };
        }

        return userData;
      },
      didOpen: () => {
        const roleSelect = document.getElementById('swal-role');
        const profileFields = document.getElementById('profile-fields');

        const updateProfileFields = () => {
          const role = roleSelect.value;
          if (role === 'ENSEIGNANT') {
            profileFields.innerHTML =
              '<input id="swal-departement" class="swal2-input" placeholder="Département">' +
              '<input id="swal-grade" class="swal2-input" placeholder="Grade">';
          } else if (role === 'ETUDIANT') {
            profileFields.innerHTML =
              '<input id="swal-niveau" class="swal2-input" placeholder="Niveau (L1, L2, etc.)">' +
              '<input id="swal-filiere" class="swal2-input" placeholder="Filière">' +
              '<input id="swal-matricule" class="swal2-input" placeholder="Matricule *" required>';
          } else {
            profileFields.innerHTML = '';
          }
        };

        roleSelect.addEventListener('change', updateProfileFields);
        updateProfileFields();
      }
    });

    if (formValues) {
      try {
        await adminCreateUser(formValues);
        Swal.fire('Succès!', 'Utilisateur créé avec succès.', 'success');
        loadUsers();
      } catch (error) {
        Swal.fire('Erreur', 'Erreur lors de la création: ' + (error.response?.data?.detail || 'Erreur inconnue'), 'error');
      }
    }
  };

  const handleEditUser = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const { value: formValues } = await Swal.fire({
      title: 'Modifier l\'Utilisateur',
      html:
        `<input id="swal-nom" class="swal2-input" placeholder="Nom *" value="${user.nom || ''}" required>` +
        `<input id="swal-prenom" class="swal2-input" placeholder="Prénom" value="${user.prenom || ''}">` +
        `<input id="swal-email" class="swal2-input" placeholder="Email *" value="${user.email || ''}" type="email" required>` +
        `<select id="swal-role" class="swal2-input">` +
          `<option value="ETUDIANT" ${user.role === 'ETUDIANT' ? 'selected' : ''}>Étudiant</option>` +
          `<option value="ENSEIGNANT" ${user.role === 'ENSEIGNANT' ? 'selected' : ''}>Enseignant</option>` +
          `<option value="ADMINISTRATEUR" ${user.role === 'ADMINISTRATEUR' ? 'selected' : ''}>Administrateur</option>` +
        `</select>` +
        '<div id="profile-fields"></div>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Modifier',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const nom = document.getElementById('swal-nom').value;
        const prenom = document.getElementById('swal-prenom').value;
        const email = document.getElementById('swal-email').value;
        const role = document.getElementById('swal-role').value;

        if (!nom || !email) {
          Swal.showValidationMessage('Veuillez remplir tous les champs obligatoires');
          return false;
        }

        let userData = { nom, prenom, email, role };

        if (role === 'ENSEIGNANT') {
          const departement = document.getElementById('swal-departement')?.value || '';
          const grade = document.getElementById('swal-grade')?.value || '';
          userData = { ...userData, departement, grade };
        } else if (role === 'ETUDIANT') {
          const niveau = document.getElementById('swal-niveau')?.value || '';
          const filiere = document.getElementById('swal-filiere')?.value || '';
          const matricule = document.getElementById('swal-matricule')?.value || '';
          userData = { ...userData, niveau, filiere, matricule };
        }

        return userData;
      },
      didOpen: () => {
        const roleSelect = document.getElementById('swal-role');
        const profileFields = document.getElementById('profile-fields');

        const updateProfileFields = () => {
          const role = roleSelect.value;
          if (role === 'ENSEIGNANT') {
            profileFields.innerHTML =
              `<input id="swal-departement" class="swal2-input" placeholder="Département" value="${user.departement || ''}">` +
              `<input id="swal-grade" class="swal2-input" placeholder="Grade" value="${user.grade || ''}">`;
          } else if (role === 'ETUDIANT') {
            profileFields.innerHTML =
              `<input id="swal-niveau" class="swal2-input" placeholder="Niveau (L1, L2, etc.)" value="${user.niveau || ''}">` +
              `<input id="swal-filiere" class="swal2-input" placeholder="Filière" value="${user.filiere || ''}">` +
              `<input id="swal-matricule" class="swal2-input" placeholder="Matricule *" value="${user.matricule || ''}" required>`;
          } else {
            profileFields.innerHTML = '';
          }
        };

        roleSelect.addEventListener('change', updateProfileFields);
        updateProfileFields();
      }
    });

    if (formValues) {
      try {
        await adminUpdateUser(userId, formValues);
        Swal.fire('Succès!', 'Utilisateur modifié avec succès.', 'success');
        loadUsers();
      } catch (error) {
        Swal.fire('Erreur', 'Erreur lors de la modification: ' + (error.response?.data?.detail || 'Erreur inconnue'), 'error');
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Liste des Utilisateurs ({users.length})</h3>
        <button
          onClick={handleCreateUser}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ➕ Créer Utilisateur
        </button>
      </div>

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
                  {user.role === 'ENSEIGNANT' && user.departement && (
                    <div className="profile-info">
                      <small>Dépt: {user.departement}</small>
                      <small>Grade: {user.grade}</small>
                    </div>
                  )}
                  {user.role === 'ETUDIANT' && user.niveau && (
                    <div className="profile-info">
                      <small>Niv: {user.niveau}</small>
                      <small>Fil: {user.filiere}</small>
                    </div>
                  )}
                </td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEditUser(user.id)}
                    title="Modifier"
                  >
                    ✏️
                  </button>
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