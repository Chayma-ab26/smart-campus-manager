import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AdminHeader from "../AdminHeader";
import "./salle.css";

const API_URL = "http://localhost:8000/api/salles/";

export default function SallesPage() {
  const [salles, setSalles] = useState([]);

  useEffect(() => {
    fetchSalles();
  }, []);

  const fetchSalles = async () => {
    try {
      const res = await axios.get(API_URL);
      setSalles(res.data);
    } catch (error) {
      console.error("Erreur de chargement :", error);
    }
  };

  // Ajouter salle
  const handleAdd = async () => {
    const { value: formValues } = await Swal.fire({
      title: "➕ Nouvelle salle",
      html: `
        <input id="nom" class="swal2-input" placeholder="Nom de la salle" />
        <div style="margin-top:10px">
          <label>
            <input id="disponibilite" type="checkbox" checked />
            Disponible
          </label>
        </div>
      `,
      confirmButtonText: "Ajouter",
      preConfirm: () => {
        const nom = document.getElementById("nom").value.trim();
        const disponibilite = document.getElementById("disponibilite").checked;
        if (!nom) Swal.showValidationMessage("Le nom est requis !");
        return { nom, disponibilite };
      },
    });

    if (formValues) {
      try {
        await axios.post(API_URL, formValues);
        Swal.fire("✅ Ajoutée", "Salle ajoutée avec succès !", "success");
        fetchSalles();
      } catch {
        Swal.fire("Erreur", "Impossible d'ajouter la salle.", "error");
      }
    }
  };

  // Modifier salle
  const handleEdit = async (salle) => {
    const { value: formValues } = await Swal.fire({
      title: "✏️ Modifier la salle",
      html: `
        <input id="nom" class="swal2-input" value="${salle.nom}" />
        <div style="margin-top:10px">
          <label>
            <input id="disponibilite" type="checkbox" ${
              salle.disponibilite ? "checked" : ""
            } /> Disponible
          </label>
        </div>
      `,
      confirmButtonText: "Mettre à jour",
      preConfirm: () => {
        const nom = document.getElementById("nom").value.trim();
        const disponibilite = document.getElementById("disponibilite").checked;
        if (!nom) Swal.showValidationMessage("Le nom est requis !");
        return { nom, disponibilite };
      },
    });

    if (formValues) {
      try {
        await axios.put(`${API_URL}${salle.id}/`, formValues);
        Swal.fire("✅ Modifiée", "Salle mise à jour avec succès !", "success");
        fetchSalles();
      } catch {
        Swal.fire("Erreur", "Impossible de modifier la salle.", "error");
      }
    }
  };

  // Supprimer salle
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Supprimer cette salle ?",
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
          Swal.fire("🗑️ Supprimée", "Salle supprimée avec succès !", "success");
          fetchSalles();
        } catch {
          Swal.fire("Erreur", "Impossible de supprimer la salle.", "error");
        }
      }
    });
  };

  return (
<div>
         <AdminHeader />
<div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
  
  <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-6 border border-gray-100 mt-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            🏢 Gestion des Salles
          </h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            ➕ Ajouter une salle
          </button>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-blue-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600 font-semibold">#</th>
                <th className="px-6 py-3 text-left text-gray-600 font-semibold">Nom</th>
                <th className="px-6 py-3 text-center text-gray-600 font-semibold">
                  Disponibilité
                </th>
                <th className="px-6 py-3 text-center text-gray-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {salles.length > 0 ? (
                salles.map((salle, index) => (
                  <tr
                    key={salle.id}
                    className="hover:bg-gray-50 border-b transition"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{salle.nom}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          salle.disponibilite
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {salle.disponibilite ? "Disponible" : "Occupée"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-3">
                      <button
                        onClick={() => handleEdit(salle)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg transition"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(salle.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    Aucune salle disponible.
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
