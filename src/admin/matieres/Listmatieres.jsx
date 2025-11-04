import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AdminHeader from "../AdminHeader";

const API_URL = "http://localhost:8000/api/matieres/";
const API_ENSEIGNANTS = "http://localhost:8000/api/enseignants/";
const API_CLASSES = "http://localhost:8000/api/classes/";

export default function MatierePage() {
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchMatieres();
    fetchEnseignants();
    fetchClasses();
  }, []);

  const fetchMatieres = async () => {
    try {
      const res = await axios.get(API_URL);
      setMatieres(res.data);
    } catch (error) {
      console.error("Erreur de chargement des matières :", error);
    }
  };

  const fetchEnseignants = async () => {
    try {
      const res = await axios.get(API_ENSEIGNANTS);
      setEnseignants(res.data);
    } catch (error) {
      console.error("Erreur de chargement des enseignants :", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(API_CLASSES);
      setClasses(res.data);
    } catch (error) {
      console.error("Erreur de chargement des classes :", error);
    }
  };

  const handleAdd = async () => {
    const { value: formValues } = await Swal.fire({
      title: "➕ Nouvelle matière",
      html: `
        <input id="nom" class="swal2-input" placeholder="Nom" />
        <input id="code" class="swal2-input" placeholder="Code" />
        <input id="volume" class="swal2-input" placeholder="Volume horaire" type="number" />
        <select id="enseignant" class="swal2-input">
          ${enseignants.map(e => `<option value="${e.id}">${e.nom}</option>`).join("")}
        </select>
        <select id="classe" class="swal2-input">
          ${classes.map(c => `<option value="${c.id}">${c.nom}</option>`).join("")}
        </select>
      `,
      confirmButtonText: "Ajouter",
      preConfirm: () => {
        const nom = document.getElementById("nom").value.trim();
        const code = document.getElementById("code").value.trim();
        const volume_horaire = parseInt(document.getElementById("volume").value);
        const enseignant = parseInt(document.getElementById("enseignant").value);
        const classe = parseInt(document.getElementById("classe").value);
        if (!nom || !code || !volume_horaire || !enseignant || !classe)
          Swal.showValidationMessage("Tous les champs sont requis !");
        return { nom, code, volume_horaire, enseignant, classe };
      },
    });

    if (formValues) {
      try {
        await axios.post(API_URL, formValues);
        Swal.fire("✅ Ajoutée", "Matière ajoutée avec succès !", "success");
        fetchMatieres();
      } catch {
        Swal.fire("Erreur", "Impossible d'ajouter la matière.", "error");
      }
    }
  };

  const handleEdit = async (matiere) => {
    const { value: formValues } = await Swal.fire({
      title: "✏️ Modifier matière",
      html: `
        <input id="nom" class="swal2-input" value="${matiere.nom}" />
        <input id="code" class="swal2-input" value="${matiere.code}" />
        <input id="volume" class="swal2-input" value="${matiere.volume_horaire}" type="number" />
        <select id="enseignant" class="swal2-input">
          ${enseignants.map(e => `<option value="${e.id}" ${e.id === matiere.enseignant ? "selected" : ""}>${e.nom}</option>`).join("")}
        </select>
        <select id="classe" class="swal2-input">
          ${classes.map(c => `<option value="${c.id}" ${c.id === matiere.classe ? "selected" : ""}>${c.nom}</option>`).join("")}
        </select>
      `,
      confirmButtonText: "Mettre à jour",
      preConfirm: () => {
        const nom = document.getElementById("nom").value.trim();
        const code = document.getElementById("code").value.trim();
        const volume_horaire = parseInt(document.getElementById("volume").value);
        const enseignant = parseInt(document.getElementById("enseignant").value);
        const classe = parseInt(document.getElementById("classe").value);
        if (!nom || !code || !volume_horaire || !enseignant || !classe)
          Swal.showValidationMessage("Tous les champs sont requis !");
        return { nom, code, volume_horaire, enseignant, classe };
      },
    });

    if (formValues) {
      try {
        await axios.put(`${API_URL}${matiere.id}/`, formValues);
        Swal.fire("✅ Modifiée", "Matière mise à jour !", "success");
        fetchMatieres();
      } catch {
        Swal.fire("Erreur", "Impossible de modifier la matière.", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Supprimer cette matière ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}${id}/`);
          Swal.fire("🗑️ Supprimée", "Matière supprimée !", "success");
          fetchMatieres();
        } catch {
          Swal.fire("Erreur", "Impossible de supprimer la matière.", "error");
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-gray-50 flex flex-col">
      {/* Header pleine largeur */}
      <div className="w-full sticky top-0 z-50">
        <AdminHeader className="bg-primary text-white shadow-lg w-full" />
      </div>

      {/* Main Content */}
      <div className="flex justify-center p-10">
        <div className="card w-full max-w-6xl bg-base-100 shadow-xl rounded-2xl">
          {/* Header Card */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              📚 Gestion des Matières
            </h1>
            <button
              onClick={handleAdd}
              className="btn btn-primary btn-sm text-white shadow-md hover:shadow-lg transition"
            >
              ➕ Ajouter matière
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto p-6">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th>Code</th>
                  <th>Volume H</th>
                  <th>Enseignant</th>
                  <th>Classe</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {matieres.length > 0 ? (
                  matieres.map((matiere, index) => (
                    <tr key={matiere.id}>
                      <th>{index + 1}</th>
                      <td>{matiere.nom}</td>
                      <td>{matiere.code}</td>
                      <td>{matiere.volume_horaire}</td>
                      <td>{matiere.enseignant_nom}</td>
                      <td>{matiere.classe_nom}</td>
                      <td className="flex gap-2">
                        <button onClick={() => handleEdit(matiere)} className="btn btn-warning btn-xs">
                          ✏️
                        </button>
                        <button onClick={() => handleDelete(matiere.id)} className="btn btn-error btn-xs">
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center italic text-gray-400">
                      Aucune matière disponible.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
