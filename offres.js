const API_URL = "http://ealareunion.local/wp-json/wp/v2/offre";
const container = document.getElementById("offres");
const selectFiltre = document.getElementById("filtreContrat");
let toutesOffres = [];

// Récupération des offres
fetch(API_URL)
  .then(response => {
    if (!response.ok) throw new Error("Erreur API : " + response.status);
    return response.json();
  })
  .then(offres => {
    toutesOffres = offres;

    if (offres.length === 0) {
      container.innerHTML = "<p>Aucune offre disponible pour le moment.</p>";
      return;
    }

    afficherOffres(toutesOffres); // affichage initial
  })
  .catch(error => {
    console.error("Erreur :", error);
    container.innerHTML = "<p>Impossible de charger les offres.</p>";
  });

// Fonction pour afficher les offres
function afficherOffres(offres) {
  container.innerHTML = ""; // vide le conteneur

  offres.forEach(offre => {
    const acf = offre.acf || {};
    const card = document.createElement("div");
    card.className = "card bg-base-100 shadow-sm mx-auto p-4 mb-4";

    card.innerHTML = `
      <h2 class="text-xl font-bold mb-2">${offre.title.rendered}</h2>
      <p><strong>Description :</strong> ${acf.description || "Non précisé"}</p>
      <p><strong>Salaire :</strong> ${acf.salaire || "Non précisé"}</p>
      <p><strong>Type de contrat :</strong> ${acf.type_de_contrat || "Non précisé"}</p>
      <p><strong>Lieu :</strong> ${acf.localisation || "Non précisé"}</p>
      <p><strong>Date de publication :</strong> ${new Date(offre.date).toLocaleDateString()}</p>
    `;
    container.appendChild(card);
  });
}

// Écoute du filtre
selectFiltre.addEventListener("change", () => {
  const value = selectFiltre.value;

  if (value === "all") {
    afficherOffres(toutesOffres);
  } else {
    const filtered = toutesOffres.filter(o => o.acf?.type_de_contrat === value);
    afficherOffres(filtered);
  }
});
