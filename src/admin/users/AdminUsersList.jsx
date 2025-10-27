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
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [refresh]);

  useEffect(() => {
    let filtered = users;

    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply sub-filters for students
    if (roleFilter === 'ETUDIANT') {
      if (filiereFilter) {
        filtered = filtered.filter(user => user.filiere && user.filiere.toLowerCase().includes(filiereFilter.toLowerCase()));
      }
      if (matriculeFilter) {
        filtered = filtered.filter(user => user.matricule && user.matricule.toLowerCase().includes(matriculeFilter.toLowerCase()));
      }
      if (niveauFilter) {
        filtered = filtered.filter(user => user.niveau && user.niveau.toLowerCase().includes(niveauFilter.toLowerCase()));
      }
    }

    // Apply sub-filters for teachers
    if (roleFilter === 'ENSEIGNANT') {
      if (departementFilter) {
        filtered = filtered.filter(user => user.departement && user.departement.toLowerCase().includes(departementFilter.toLowerCase()));
      }
      if (gradeFilter) {
        filtered = filtered.filter(user => user.grade && user.grade.toLowerCase().includes(gradeFilter.toLowerCase()));
      }
    }

    setFilteredUsers(filtered);
  }, [users, roleFilter, filiereFilter, matriculeFilter, niveauFilter, departementFilter, gradeFilter]);

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
      title: '<div style="display: flex; align-items: center; gap: 10px; color: #28a745;"><i class="fas fa-user-plus" style="font-size: 24px;"></i>Créer un Nouvel Utilisateur</div>',
      html: `
        <div style="text-align: left; max-width: 800px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
            <div style="display: flex; flex-direction: column;">
              <label style="font-weight: 600; color: #333; margin-bottom: 8px; font-size: 15px;">Nom *</label>
              <input id="swal-nom" class="swal2-input" placeholder="Entrez le nom complet" required
                     style="padding: 14px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 15px; transition: border-color 0.3s ease;">
            </div>
            <div style="display: flex; flex-direction: column;">
              <label style="font-weight: 600; color: #333; margin-bottom: 8px; font-size: 15px;">Prénom</label>
              <input id="swal-prenom" class="swal2-input" placeholder="Entrez le prénom"
                     style="padding: 14px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 15px; transition: border-color 0.3s ease;">
            </div>
          </div>

          <div style="display: flex; flex-direction: column; margin-bottom: 25px;">
            <label style="font-weight: 600; color: #333; margin-bottom: 8px; font-size: 15px;">Email *</label>
            <input id="swal-email" class="swal2-input" placeholder="exemple@universite.edu" type="email" required
                   style="padding: 14px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 15px; transition: border-color 0.3s ease;">
          </div>

          <div style="display: flex; flex-direction: column; margin-bottom: 25px;">
            <label style="font-weight: 600; color: #333; margin-bottom: 8px; font-size: 15px;">Mot de passe *</label>
            <input id="swal-password" class="swal2-input" placeholder="Minimum 6 caractères" type="password" required
                   style="padding: 14px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 15px; transition: border-color 0.3s ease;">
          </div>

          <div style="display: flex; flex-direction: column; margin-bottom: 25px;">
            <label style="font-weight: 600; color: #333; margin-bottom: 8px; font-size: 15px;">Rôle</label>
            <select id="swal-role" class="swal2-input"
                    style="padding: 14px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 15px; background-color: white; transition: border-color 0.3s ease;">
              <option value="ETUDIANT">🎓 Étudiant</option>
              <option value="ENSEIGNANT">👨‍🏫 Enseignant</option>
              <option value="ADMINISTRATEUR">⚙️ Administrateur</option>
            </select>
          </div>

          <div id="profile-fields" style="margin-top: 25px; padding: 20px; background-color: #f8f9fa; border-radius: 10px; border: 1px solid #dee2e6;"></div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-plus"></i> Créer',
      cancelButtonText: '<i class="fas fa-times"></i> Annuler',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      customClass: {
        popup: 'animated fadeInDown',
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-secondary'
      },
      preConfirm: () => {
        const nom = document.getElementById('swal-nom').value;
        const prenom = document.getElementById('swal-prenom').value;
        const email = document.getElementById('swal-email').value;
        const password = document.getElementById('swal-password').value;
        const role = document.getElementById('swal-role').value;

        if (!nom || !email || !password) {
          Swal.showValidationMessage('<div style="color: #dc3545; font-weight: 600;"><i class="fas fa-exclamation-triangle"></i> Veuillez remplir tous les champs obligatoires</div>');
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
            profileFields.innerHTML = `
              <h4 style="color: #007bff; margin-bottom: 15px; font-size: 16px;"><i class="fas fa-chalkboard-teacher"></i> Informations Enseignant</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="display: flex; flex-direction: column;">
                  <label style="font-weight: 600; color: #333; margin-bottom: 5px; font-size: 14px;">Département</label>
                  <input id="swal-departement" class="swal2-input" placeholder="Ex: Informatique"
                         style="padding: 10px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                </div>
                <div style="display: flex; flex-direction: column;">
                  <label style="font-weight: 600; color: #333; margin-bottom: 5px; font-size: 14px;">Grade</label>
                  <input id="swal-grade" class="swal2-input" placeholder="Ex: Professeur"
                         style="padding: 10px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                </div>
              </div>
            `;
          } else if (role === 'ETUDIANT') {
            profileFields.innerHTML = `
              <h4 style="color: #28a745; margin-bottom: 15px; font-size: 16px;"><i class="fas fa-graduation-cap"></i> Informations Étudiant</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div style="display: flex; flex-direction: column;">
                  <label style="font-weight: 600; color: #333; margin-bottom: 5px; font-size: 14px;">Niveau</label>
                  <input id="swal-niveau" class="swal2-input" placeholder="Ex: L2"
                         style="padding: 10px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                </div>
                <div style="display: flex; flex-direction: column;">
                  <label style="font-weight: 600; color: #333; margin-bottom: 5px; font-size: 14px;">Filière</label>
                  <input id="swal-filiere" class="swal2-input" placeholder="Ex: Informatique"
                         style="padding: 10px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                </div>
              </div>
              <div style="display: flex; flex-direction: column;">
                <label style="font-weight: 600; color: #333; margin-bottom: 5px; font-size: 14px;">Matricule *</label>
                <input id="swal-matricule" class="swal2-input" placeholder="Numéro d'étudiant" required
                       style="padding: 10px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
              </div>
            `;
          } else {
            profileFields.innerHTML = '';
          }
        };

        roleSelect.addEventListener('change', updateProfileFields);
        updateProfileFields();

        // Add focus effects to inputs
        const inputs = document.querySelectorAll('.swal2-input');
        inputs.forEach(input => {
          input.addEventListener('focus', () => {
            input.style.borderColor = '#007bff';
            input.style.boxShadow = '0 0 0 0.2rem rgba(0, 123, 255, 0.25)';
          });
          input.addEventListener('blur', () => {
            input.style.borderColor = '#e9ecef';
            input.style.boxShadow = 'none';
          });
        });
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
      title: '<div style="display: flex; align-items: center; gap: 10px; color: #ffc107;"><i class="fas fa-user-edit" style="font-size: 24px;"></i>Modifier l\'Utilisateur</div>',
      html: `
        <div style="text-align: left; max-width: 800px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
            <div style="display: flex; flex-direction: column;">
              <label style="font-weight: 600; color: #333; margin-bottom: 8px; font-size: 15px;">Nom *</label>
              <input id="swal-nom" class="swal2-input" placeholder="Entrez le nom complet" value="${user.nom || ''}" required
                     style="padding: 14px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 15px; transition: border-color 0.3s ease;">
            </div>
            <div style="display: flex; flex-direction: column;">
              <label style="font-weight: 600; color: #333; margin-bottom: 8px; font-size: 15px;">Prénom</label>
              <input id="swal-prenom" class="swal2-input" placeholder="Entrez le prénom" value="${user.prenom || ''}"
                     style="padding: 14px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 15px; transition: border-color 0.3s ease;">
            </div>
          </div>

          <div style="display: flex; flex-direction: column; margin-bottom: 25px;">
            <label style="font-weight: 600; color: #333; margin-bottom: 8px; font-size: 15px;">Email *</label>
            <input id="swal-email" class="swal2-input" placeholder="exemple@universite.edu" value="${user.email || ''}" type="email" required
                   style="padding: 14px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 15px; transition: border-color 0.3s ease;">
          </div>

          <div style="display: flex; flex-direction: column; margin-bottom: 25px;">
            <label style="font-weight: 600; color: #333; margin-bottom: 8px; font-size: 15px;">Rôle</label>
            <select id="swal-role" class="swal2-input"
                    style="padding: 14px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 15px; background-color: white; transition: border-color 0.3s ease;">
              <option value="ETUDIANT" ${user.role === 'ETUDIANT' ? 'selected' : ''}>🎓 Étudiant</option>
              <option value="ENSEIGNANT" ${user.role === 'ENSEIGNANT' ? 'selected' : ''}>👨‍🏫 Enseignant</option>
              <option value="ADMINISTRATEUR" ${user.role === 'ADMINISTRATEUR' ? 'selected' : ''}>⚙️ Administrateur</option>
            </select>
          </div>

          <div id="profile-fields" style="margin-top: 25px; padding: 20px; background-color: #f8f9fa; border-radius: 10px; border: 1px solid #dee2e6;"></div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-save"></i> Modifier',
      cancelButtonText: '<i class="fas fa-times"></i> Annuler',
      confirmButtonColor: '#ffc107',
      cancelButtonColor: '#6c757d',
      customClass: {
        popup: 'animated fadeInDown',
        confirmButton: 'btn btn-warning',
        cancelButton: 'btn btn-secondary'
      },
      preConfirm: () => {
        const nom = document.getElementById('swal-nom').value;
        const prenom = document.getElementById('swal-prenom').value;
        const email = document.getElementById('swal-email').value;
        const role = document.getElementById('swal-role').value;

        if (!nom || !email) {
          Swal.showValidationMessage('<div style="color: #dc3545; font-weight: 600;"><i class="fas fa-exclamation-triangle"></i> Veuillez remplir tous les champs obligatoires</div>');
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
            profileFields.innerHTML = `
              <h4 style="color: #007bff; margin-bottom: 15px; font-size: 16px;"><i class="fas fa-chalkboard-teacher"></i> Informations Enseignant</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="display: flex; flex-direction: column;">
                  <label style="font-weight: 600; color: #333; margin-bottom: 5px; font-size: 14px;">Département</label>
                  <input id="swal-departement" class="swal2-input" placeholder="Ex: Informatique" value="${user.departement || ''}"
                         style="padding: 10px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                </div>
                <div style="display: flex; flex-direction: column;">
                  <label style="font-weight: 600; color: #333; margin-bottom: 5px; font-size: 14px;">Grade</label>
                  <input id="swal-grade" class="swal2-input" placeholder="Ex: Professeur" value="${user.grade || ''}"
                         style="padding: 10px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                </div>
              </div>
            `;
          } else if (role === 'ETUDIANT') {
            profileFields.innerHTML = `
              <h4 style="color: #28a745; margin-bottom: 15px; font-size: 16px;"><i class="fas fa-graduation-cap"></i> Informations Étudiant</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div style="display: flex; flex-direction: column;">
                  <label style="font-weight: 600; color: #333; margin-bottom: 5px; font-size: 14px;">Niveau</label>
                  <input id="swal-niveau" class="swal2-input" placeholder="Ex: L2" value="${user.niveau || ''}"
                         style="padding: 10px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                </div>
                <div style="display: flex; flex-direction: column;">
                  <label style="font-weight: 600; color: #333; margin-bottom: 5px; font-size: 14px;">Filière</label>
                  <input id="swal-filiere" class="swal2-input" placeholder="Ex: Informatique" value="${user.filiere || ''}"
                         style="padding: 10px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                </div>
              </div>
              <div style="display: flex; flex-direction: column;">
                <label style="font-weight: 600; color: #333; margin-bottom: 5px; font-size: 14px;">Matricule *</label>
                <input id="swal-matricule" class="swal2-input" placeholder="Numéro d'étudiant" value="${user.matricule || ''}" required
                       style="padding: 10px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
              </div>
            `;
          } else {
            profileFields.innerHTML = '';
          }
        };

        roleSelect.addEventListener('change', updateProfileFields);
        updateProfileFields();

        // Add focus effects to inputs
        const inputs = document.querySelectorAll('.swal2-input');
        inputs.forEach(input => {
          input.addEventListener('focus', () => {
            input.style.borderColor = '#007bff';
            input.style.boxShadow = '0 0 0 0.2rem rgba(0, 123, 255, 0.25)';
          });
          input.addEventListener('blur', () => {
            input.style.borderColor = '#e9ecef';
            input.style.boxShadow = 'none';
          });
        });
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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '24px' }}>Liste des Utilisateurs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>Filtrer par rôle:</span>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  // Reset sub-filters when changing role
                  if (e.target.value !== 'ETUDIANT') {
                    setFiliereFilter('');
                    setMatriculeFilter('');
                    setNiveauFilter('');
                  }
                  if (e.target.value !== 'ENSEIGNANT') {
                    setDepartementFilter('');
                    setGradeFilter('');
                  }
                }}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  fontSize: '14px',
                  minWidth: '150px'
                }}
              >
                <option value="ALL">Tous les rôles</option>
                <option value="ETUDIANT">Étudiants</option>
                <option value="ENSEIGNANT">Enseignants</option>
                <option value="ADMINISTRATEUR">Administrateurs</option>
              </select>
              <span style={{ fontSize: '14px', color: '#666' }}>
                ({filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''})
              </span>
            </div>

            {roleFilter === 'ETUDIANT' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '15px',
                backgroundColor: '#f0f8ff',
                borderRadius: '8px',
                border: '1px solid #b3d9ff'
              }}>
                <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Filtres étudiants:</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '13px', color: '#555', fontWeight: '500' }}>Filière:</label>
                  <input
                    type="text"
                    placeholder="Ex: Informatique"
                    value={filiereFilter}
                    onChange={(e) => setFiliereFilter(e.target.value)}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '13px',
                      width: '120px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '13px', color: '#555', fontWeight: '500' }}>Matricule:</label>
                  <input
                    type="text"
                    placeholder="Numéro étudiant"
                    value={matriculeFilter}
                    onChange={(e) => setMatriculeFilter(e.target.value)}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '13px',
                      width: '120px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '13px', color: '#555', fontWeight: '500' }}>Niveau:</label>
                  <input
                    type="text"
                    placeholder="Ex: L2"
                    value={niveauFilter}
                    onChange={(e) => setNiveauFilter(e.target.value)}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '13px',
                      width: '80px'
                    }}
                  />
                </div>

                {(filiereFilter || matriculeFilter || niveauFilter) && (
                  <button
                    onClick={() => {
                      setFiliereFilter('');
                      setMatriculeFilter('');
                      setNiveauFilter('');
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                    title="Effacer tous les filtres étudiants"
                  >
                    🗑️ Effacer
                  </button>
                )}
              </div>
            )}

            {roleFilter === 'ENSEIGNANT' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '15px',
                backgroundColor: '#fff3cd',
                borderRadius: '8px',
                border: '1px solid #ffeaa7'
              }}>
                <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Filtres enseignants:</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '13px', color: '#555', fontWeight: '500' }}>Département:</label>
                  <input
                    type="text"
                    placeholder="Ex: Informatique"
                    value={departementFilter}
                    onChange={(e) => setDepartementFilter(e.target.value)}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '13px',
                      width: '120px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '13px', color: '#555', fontWeight: '500' }}>Grade:</label>
                  <input
                    type="text"
                    placeholder="Ex: Professeur"
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '13px',
                      width: '120px'
                    }}
                  />
                </div>

                {(departementFilter || gradeFilter) && (
                  <button
                    onClick={() => {
                      setDepartementFilter('');
                      setGradeFilter('');
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                    title="Effacer tous les filtres enseignants"
                  >
                    🗑️ Effacer
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleCreateUser}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
        >
          ➕ Créer Utilisateur
        </button>
      </div>

      <div className="users-table-container" style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table className="users-table" style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead style={{
            backgroundColor: '#343a40',
            color: 'white'
          }}>
            <tr>
              <th style={{
                padding: '15px 12px',
                textAlign: 'left',
                fontWeight: '600',
                borderBottom: '2px solid #dee2e6'
              }}>ID</th>
              <th style={{
                padding: '15px 12px',
                textAlign: 'left',
                fontWeight: '600',
                borderBottom: '2px solid #dee2e6'
              }}>Nom Complet</th>
              <th style={{
                padding: '15px 12px',
                textAlign: 'left',
                fontWeight: '600',
                borderBottom: '2px solid #dee2e6'
              }}>Email</th>
              <th style={{
                padding: '15px 12px',
                textAlign: 'left',
                fontWeight: '600',
                borderBottom: '2px solid #dee2e6'
              }}>Rôle</th>
              <th style={{
                padding: '15px 12px',
                textAlign: 'left',
                fontWeight: '600',
                borderBottom: '2px solid #dee2e6'
              }}>Informations</th>
              <th style={{
                padding: '15px 12px',
                textAlign: 'center',
                fontWeight: '600',
                borderBottom: '2px solid #dee2e6'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={{
                backgroundColor: user.id % 2 === 0 ? '#f8f9fa' : 'white',
                transition: 'background-color 0.2s ease'
              }}>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500' }}>{user.id}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500' }}>
                  {user.prenom && user.nom ? `${user.prenom} ${user.nom}` : user.nom}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', color: '#666' }}>{user.email}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{getRoleBadge(user.role)}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  {user.role === 'ENSEIGNANT' && user.departement && (
                    <div style={{
                      backgroundColor: '#e3f2fd',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#1976d2'
                    }}>
                      <div><strong>Dépt:</strong> {user.departement}</div>
                      <div><strong>Grade:</strong> {user.grade}</div>
                    </div>
                  )}
                  {user.role === 'ETUDIANT' && user.niveau && (
                    <div style={{
                      backgroundColor: '#f3e5f5',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#7b1fa2'
                    }}>
                      <div><strong>Niv:</strong> {user.niveau}</div>
                      <div><strong>Fil:</strong> {user.filiere}</div>
                      {user.matricule && <div><strong>Mat:</strong> {user.matricule}</div>}
                    </div>
                  )}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEditUser(user.id)}
                      style={{
                        backgroundColor: '#ffc107',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#e0a800'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#ffc107'}
                      title="Modifier"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, user.nom)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                      title="Supprimer"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
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