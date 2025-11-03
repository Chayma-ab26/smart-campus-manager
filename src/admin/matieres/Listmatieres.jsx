import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AdminHeader from "../AdminHeader";
import "./matiere.css";

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

  // Ajouter matière
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

  // Modifier matière
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

  // Supprimer matière
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Supprimer cette matière ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#e11d48",
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
  <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
    {/* Header full width */}
    <AdminHeader className="w-full sticky top-0 z-50" />

    {/* Conteneur central */}
    <div className="max-w-6xl mx-auto p-8 mt-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">📚 Gestion des Matières</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          ➕ Ajouter matière
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-blue-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Nom</th>
              <th className="px-6 py-3 text-left">Code</th>
              <th className="px-6 py-3 text-center">Volume H</th>
              <th className="px-6 py-3 text-left">Enseignant</th>
              <th className="px-6 py-3 text-left">Classe</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {matieres.length > 0 ? (
              matieres.map((matiere, index) => (
                <tr key={matiere.id} className="hover:bg-gray-50 border-b">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{matiere.nom}</td>
                  <td className="px-6 py-4">{matiere.code}</td>
                  <td className="px-6 py-4 text-center">{matiere.volume_horaire}</td>
                  <td className="px-6 py-4">{matiere.enseignant_nom}</td>
                  <td className="px-6 py-4">{matiere.classe_nom}</td>
                  <td className="px-6 py-4 text-center space-x-3">
                    <button
                      onClick={() => handleEdit(matiere)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg transition"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(matiere.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500 italic">
                  Aucune matière disponible.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}