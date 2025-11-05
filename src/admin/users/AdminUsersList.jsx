import React, { useState, useEffect } from 'react';
import { adminGetUsers, adminDeleteUser, adminCreateUser, adminUpdateUser } from '../../api/auth';
import AdminHeader from '../AdminHeader';
import Swal from 'sweetalert2';
import './user.css';

export default function AdminUsersList({ refresh }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [filiereFilter, setFiliereFilter] = useState('');
  const [matriculeFilter, setMatriculeFilter] = useState('');
  const [niveauFilter, setNiveauFilter] = useState('');
  const [departementFilter, setDepartementFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await adminGetUsers();
      setUsers(usersData);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [refresh]);

  useEffect(() => {
    let filtered = users;

    if (roleFilter !== 'ALL') filtered = filtered.filter(user => user.role === roleFilter);

    if (roleFilter === 'ETUDIANT') {
      if (filiereFilter) filtered = filtered.filter(user => user.filiere?.toLowerCase().includes(filiereFilter.toLowerCase()));
      if (matriculeFilter) filtered = filtered.filter(user => user.matricule?.toLowerCase().includes(matriculeFilter.toLowerCase()));
      if (niveauFilter) filtered = filtered.filter(user => user.niveau?.toLowerCase().includes(niveauFilter.toLowerCase()));
    }

    if (roleFilter === 'ENSEIGNANT') {
      if (departementFilter) filtered = filtered.filter(user => user.departement?.toLowerCase().includes(departementFilter.toLowerCase()));
      if (gradeFilter) filtered = filtered.filter(user => user.grade?.toLowerCase().includes(gradeFilter.toLowerCase()));
    }

    setFilteredUsers(filtered);
  }, [users, roleFilter, filiereFilter, matriculeFilter, niveauFilter, departementFilter, gradeFilter]);

  const handleDeleteUser = async (userId, userName) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous supprimer l'utilisateur "${userName}" ?`,
      icon: 'warning',
      showCancelButton: true,
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
      }
    }
  };

  const handleCreateUser = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Créer un utilisateur',
      html: `
        <input id="swal-nom" class="input input-bordered w-full mb-2" placeholder="Nom *" />
        <input id="swal-prenom" class="input input-bordered w-full mb-2" placeholder="Prénom" />
        <input id="swal-email" type="email" class="input input-bordered w-full mb-2" placeholder="Email *" />
        <input id="swal-password" type="password" class="input input-bordered w-full mb-2" placeholder="Mot de passe *" />
        <select id="swal-role" class="select select-bordered w-full mb-2">
          <option value="ETUDIANT">Étudiant</option>
          <option value="ENSEIGNANT">Enseignant</option>
          <option value="ADMINISTRATEUR">Administrateur</option>
        </select>
        <div id="profile-fields"></div>
      `,
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
          Swal.showValidationMessage('Tous les champs obligatoires doivent être remplis');
        }
        const data = { nom, prenom, email, password, role };
        if (role === 'ENSEIGNANT') {
          data.departement = document.getElementById('swal-departement')?.value || '';
          data.grade = document.getElementById('swal-grade')?.value || '';
        }
        if (role === 'ETUDIANT') {
          data.niveau = document.getElementById('swal-niveau')?.value || '';
          data.filiere = document.getElementById('swal-filiere')?.value || '';
          data.matricule = document.getElementById('swal-matricule')?.value || '';
        }
        return data;
      },
      didOpen: () => {
        const roleSelect = document.getElementById('swal-role');
        const profileFields = document.getElementById('profile-fields');
        const updateFields = () => {
          if (roleSelect.value === 'ENSEIGNANT') {
            profileFields.innerHTML = `
              <input id="swal-departement" class="input input-bordered w-full mb-2" placeholder="Département" />
              <input id="swal-grade" class="input input-bordered w-full mb-2" placeholder="Grade" />
            `;
          } else if (roleSelect.value === 'ETUDIANT') {
            profileFields.innerHTML = `
              <input id="swal-niveau" class="input input-bordered w-full mb-2" placeholder="Niveau" />
              <input id="swal-filiere" class="input input-bordered w-full mb-2" placeholder="Filière" />
              <input id="swal-matricule" class="input input-bordered w-full mb-2" placeholder="Matricule" />
            `;
          } else profileFields.innerHTML = '';
        };
        roleSelect.addEventListener('change', updateFields);
        updateFields();
      }
    });

    if (formValues) {
      try {
        await adminCreateUser(formValues);
        Swal.fire('Succès', 'Utilisateur créé avec succès', 'success');
        loadUsers();
      } catch {
        Swal.fire('Erreur', 'Échec de la création', 'error');
      }
    }
  };

  const handleEditUser = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const { value: formValues } = await Swal.fire({
      title: 'Modifier l’utilisateur',
      html: `
        <input id="swal-nom" class="input input-bordered w-full mb-2" placeholder="Nom *" value="${user.nom}" />
        <input id="swal-prenom" class="input input-bordered w-full mb-2" placeholder="Prénom" value="${user.prenom}" />
        <input id="swal-email" type="email" class="input input-bordered w-full mb-2" placeholder="Email *" value="${user.email}" />
        <select id="swal-role" class="select select-bordered w-full mb-2">
          <option value="ETUDIANT" ${user.role === 'ETUDIANT' ? 'selected' : ''}>Étudiant</option>
          <option value="ENSEIGNANT" ${user.role === 'ENSEIGNANT' ? 'selected' : ''}>Enseignant</option>
          <option value="ADMINISTRATEUR" ${user.role === 'ADMINISTRATEUR' ? 'selected' : ''}>Administrateur</option>
        </select>
        <div id="profile-fields"></div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Modifier',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const nom = document.getElementById('swal-nom').value;
        const prenom = document.getElementById('swal-prenom').value;
        const email = document.getElementById('swal-email').value;
        const role = document.getElementById('swal-role').value;
        const data = { nom, prenom, email, role };
        if (role === 'ENSEIGNANT') {
          data.departement = document.getElementById('swal-departement')?.value || '';
          data.grade = document.getElementById('swal-grade')?.value || '';
        }
        if (role === 'ETUDIANT') {
          data.niveau = document.getElementById('swal-niveau')?.value || '';
          data.filiere = document.getElementById('swal-filiere')?.value || '';
          data.matricule = document.getElementById('swal-matricule')?.value || '';
        }
        return data;
      },
      didOpen: () => {
        const roleSelect = document.getElementById('swal-role');
        const profileFields = document.getElementById('profile-fields');
        const updateFields = () => {
          if (roleSelect.value === 'ENSEIGNANT') {
            profileFields.innerHTML = `
              <input id="swal-departement" class="input input-bordered w-full mb-2" placeholder="Département" value="${user.departement || ''}" />
              <input id="swal-grade" class="input input-bordered w-full mb-2" placeholder="Grade" value="${user.grade || ''}" />
            `;
          } else if (roleSelect.value === 'ETUDIANT') {
            profileFields.innerHTML = `
              <input id="swal-niveau" class="input input-bordered w-full mb-2" placeholder="Niveau" value="${user.niveau || ''}" />
              <input id="swal-filiere" class="input input-bordered w-full mb-2" placeholder="Filière" value="${user.filiere || ''}" />
              <input id="swal-matricule" class="input input-bordered w-full mb-2" placeholder="Matricule" value="${user.matricule || ''}" />
            `;
          } else profileFields.innerHTML = '';
        };
        roleSelect.addEventListener('change', updateFields);
        updateFields();
      }
    });

    if (formValues) {
      try {
        await adminUpdateUser(userId, formValues);
        Swal.fire('Succès', 'Utilisateur modifié', 'success');
        loadUsers();
      } catch {
        Swal.fire('Erreur', 'Échec de la modification', 'error');
      }
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      ADMINISTRATEUR: 'badge badge-error',
      ENSEIGNANT: 'badge badge-info',
      ETUDIANT: 'badge badge-success'
    };
    return <span className={colors[role]}>{role}</span>;
  };

  if (loading) return <div className="text-center p-10">Chargement...</div>;
  if (error) return <div className="text-center text-red-500 p-10">{error}</div>;

  return (
    <div className="p-6">
      <AdminHeader />

      <div className="flex justify-between items-center mb-5">
        <h3 className="text-2xl font-bold">Liste des Utilisateurs</h3>
        <button onClick={handleCreateUser} className="btn btn-success">
          ➕ Créer Utilisateur
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          className="select select-bordered"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setFiliereFilter('');
            setMatriculeFilter('');
            setNiveauFilter('');
            setDepartementFilter('');
            setGradeFilter('');
          }}
        >
          <option value="ALL">Tous les rôles</option>
          <option value="ETUDIANT">Étudiants</option>
          <option value="ENSEIGNANT">Enseignants</option>
          <option value="ADMINISTRATEUR">Administrateurs</option>
        </select>

        {roleFilter === 'ETUDIANT' && (
          <>
            <input className="input input-bordered input-sm" placeholder="Filière" value={filiereFilter} onChange={(e) => setFiliereFilter(e.target.value)} />
            <input className="input input-bordered input-sm" placeholder="Matricule" value={matriculeFilter} onChange={(e) => setMatriculeFilter(e.target.value)} />
            <input className="input input-bordered input-sm" placeholder="Niveau" value={niveauFilter} onChange={(e) => setNiveauFilter(e.target.value)} />
          </>
        )}

        {roleFilter === 'ENSEIGNANT' && (
          <>
            <input className="input input-bordered input-sm" placeholder="Département" value={departementFilter} onChange={(e) => setDepartementFilter(e.target.value)} />
            <input className="input input-bordered input-sm" placeholder="Grade" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} />
          </>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Infos</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.prenom && user.nom ? `${user.prenom} ${user.nom}` : user.nom}</td>
                <td>{user.email}</td>
                <td>{getRoleBadge(user.role)}</td>
                <td>
                  {user.role === 'ENSEIGNANT' && (
                    <div className="badge badge-outline badge-info">
                      {user.departement} - {user.grade}
                    </div>
                  )}
                  {user.role === 'ETUDIANT' && (
                    <div className="badge badge-outline badge-success">
                      {user.niveau} - {user.filiere} - {user.matricule}
                    </div>
                  )}
                </td>
                <td className="flex gap-2">
                  <button onClick={() => handleEditUser(user.id)} className="btn btn-warning btn-sm">✏️</button>
                  <button onClick={() => handleDeleteUser(user.id, user.nom)} className="btn btn-error btn-sm">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
