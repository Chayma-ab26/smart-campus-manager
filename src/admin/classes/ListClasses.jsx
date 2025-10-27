import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AdminHeader from "../AdminHeader";
import './classe.css';

export default function ListClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const API_URL = "http://localhost:8000/api/classes/";

  // Charger les classes
  const fetchClasses = async () => {
    try {
      const response = await axios.get(API_URL);
      setClasses(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Erreur", "Impossible de charger les classes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Ajouter ou modifier une classe
  const handleAddEdit = async (classe = null) => {
    const { value: formValues } = await Swal.fire({
      title: classe ? "Modifier la classe" : "Ajouter une classe",
      html: `
        <input id="swal-nom" class="swal2-input" placeholder="Nom" value="${classe ? classe.nom : ''}">
        <input id="swal-niveau" class="swal2-input" placeholder="Niveau" value="${classe ? classe.niveau : ''}">
        <input id="swal-filiere" class="swal2-input" placeholder="Filière" value="${classe ? classe.filiere : ''}">
        <input id="swal-capacite" type="number" class="swal2-input" placeholder="Capacité max" value="${classe ? classe.capacite_max : ''}">
      `,
      confirmButtonText: classe ? "Modifier" : "Ajouter",
      cancelButtonText: "Annuler",
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const nom = document.getElementById("swal-nom").value.trim();
        const niveau = document.getElementById("swal-niveau").value.trim();
        const filiere = document.getElementById("swal-filiere").value.trim();
        const capacite_max = parseInt(document.getElementById("swal-capacite").value);

        if (!nom || !niveau || !filiere || !capacite_max) {
          Swal.showValidationMessage("Tous les champs sont obligatoires !");
        }

        return { nom, niveau, filiere, capacite_max };
      }
    });

    if (formValues) {
      try {
        if (classe) {
          await axios.put(`${API_URL}${classe.id}/`, formValues);
          Swal.fire("Succès ✅", "Classe modifiée avec succès", "success");
        } else {
          await axios.post(`${API_URL}`, formValues);
          Swal.fire("Succès 🎉", "Classe ajoutée avec succès", "success");
        }
        fetchClasses();
      } catch (error) {
        console.error(error);
        Swal.fire("Erreur", "Impossible d'enregistrer la classe", "error");
      }
    }
  };

  // Supprimer une classe
  const handleDelete = async (classeId) => {
    const result = await Swal.fire({
      title: "Confirmer la suppression",
      text: "Voulez-vous vraiment supprimer cette classe ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}${classeId}/`);
        Swal.fire("Supprimée 🗑️", "Classe supprimée avec succès", "success");
        fetchClasses();
      } catch (error) {
        console.error(error);
        Swal.fire("Erreur", "Impossible de supprimer la classe", "error");
      }
    }
  };

  // Charger les étudiants d'une classe (même niveau et filière)
  const fetchStudents = async (selectedClass) => {
    setStudentsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get("http://localhost:8000/api/users/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filtrer les étudiants par rôle, niveau et filière
      const filteredStudents = response.data.filter(user =>
        user.role === 'ETUDIANT' &&
        user.niveau === selectedClass.niveau &&
        user.filiere === selectedClass.filiere
      );
      setStudents(filteredStudents);
    } catch (error) {
      console.error(error);
      Swal.fire("Erreur", "Impossible de charger les étudiants", "error");
    } finally {
      setStudentsLoading(false);
    }
  };

  // Quand on clique sur une classe
  const handleClassClick = (classe) => {
    setSelectedClass(classe);
    fetchStudents(classe);
  };

  if (loading) return <p className="loading-text">Chargement des classes...</p>;

  return (
    <div className="classe-container">
      <AdminHeader />
      <div className="classe-content">
        <h1 className="page-title">📚 Liste des Classes</h1>
        <button onClick={() => handleAddEdit()} className="btn btn-primary add-btn">
          + Ajouter une classe
        </button>

        <div className="table-responsive">
          <table className="table table-hover shadow-sm rounded">
            <thead className="table-dark">
              <tr>
                <th>Nom</th>
                <th>Niveau</th>
                <th>Filière</th>
                <th>Capacité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classe) => (
                <tr key={classe.id}>
                  <td>
                    <button
                      onClick={() => handleClassClick(classe)}
                      className="btn btn-link p-0 class-link"
                    >
                      {classe.nom}
                    </button>
                  </td>
                  <td>{classe.niveau}</td>
                  <td>{classe.filiere}</td>
                  <td>{classe.capacite_max}</td>
                  <td>
                    <button
                      onClick={() => handleAddEdit(classe)}
                      className="btn btn-warning btn-sm me-2"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(classe.id)}
                      className="btn btn-danger btn-sm"
                    >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Étudiants de la classe sélectionnée */}
        {selectedClass && (
          <div className="students-section mt-4">
            <h2 className="students-title">👨‍🎓 Étudiants de {selectedClass.nom}</h2>
            {studentsLoading ? (
              <p>Chargement des étudiants...</p>
            ) : students.length > 0 ? (
              <table className="table table-striped shadow-sm rounded">
                <thead className="table-primary">
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Matricule</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.nom}</td>
                      <td>{student.prenom}</td>
                      <td>{student.email}</td>
                      <td>{student.matricule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucun étudiant dans cette classe.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
