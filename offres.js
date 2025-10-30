const API_URL = "http://ealareunion.local/wp-json/wp/v2/offre";
const container = document.getElementById("offres");
const selectFiltre = document.getElementById("filtreContrat");
const selectLocalisation = document.getElementById("filtreLocalisation");

let toutesOffres = [];
let toutesLocalisations = [];

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

    // Extraction et affichage dynamique des villes
    toutesLocalisations = extraireLocalisations(offres);
    afficherLocalisations(toutesLocalisations);

    // Affichage initial
    afficherOffres(toutesOffres);
  })
  .catch(error => {
    console.error("Erreur :", error);
    container.innerHTML = "<p>Impossible de charger les offres.</p>";
  });

// Fonction : extraire les villes uniques depuis les offres
function extraireLocalisations(offres) {
  return [...new Set(
    offres
      .map(o => o.acf?.localisation?.trim()) // récupère la ville
      .filter(v => v && v.length > 0) // retire les valeurs vides
  )];
}

// Fonction : remplir dynamiquement le select des localisations
function afficherLocalisations(localisations) {
  selectLocalisation.innerHTML = ""; // vide le select

  // Option "toutes les villes"
  const optionAll = document.createElement("option");
  optionAll.value = "all";
  optionAll.textContent = "Toutes les localisations";
  selectLocalisation.appendChild(optionAll);

  // Ajout dynamique de chaque ville
  localisations.forEach(ville => {
    const option = document.createElement("option");
    option.value = ville;
    option.textContent = ville;
    selectLocalisation.appendChild(option);
  });
}

// Fonction : afficher les offres
function afficherOffres(offres) {
  container.innerHTML = ""; // vide le conteneur

  offres.forEach(offre => {
    const acf = offre.acf || {};
    const card = document.createElement("div");
    card.className = "card bg-base-100 shadow-sm mx-auto p-4 mb-4";

    card.innerHTML = `
      <h2 class="text-xl font-bold mb-2">${offre.title.rendered}</h2>
      <p><strong>Entreprise :</strong> ${acf.entreprise_recruteuse || "Non précisé"}</p>
      <p><strong>Description :</strong> ${acf.description || "Non précisé"}</p>
      <p><strong>Salaire :</strong> ${acf.salaire || "Non précisé"}</p>
      <p><strong>Type de contrat :</strong> ${acf.type_de_contrat || "Non précisé"}</p>
      <p><strong>Lieu :</strong> ${acf.localisation || "Non précisé"}</p>
      <p><strong>Date de publication :</strong> ${new Date(offre.date).toLocaleDateString()}</p>
      <button class="text-xl font-bold text-white p-2 bg-green-700 hover:bg-green-600 cursor-pointer mt-5">Postuler</button>
    `;
    container.appendChild(card);
  });
}

// Filtre contrat
selectFiltre.addEventListener("change", () => {
  const value = selectFiltre.value;

  if (value === "all") {
    afficherOffres(toutesOffres);
  } else {
    const filtered = toutesOffres.filter(o => o.acf?.type_de_contrat === value);
    afficherOffres(filtered);
  }
});

// Filtre localisation
selectLocalisation.addEventListener("change", () => {
  const value = selectLocalisation.value;

  if (value === "all") {
    afficherOffres(toutesOffres);
  } else {
    const filtered = toutesOffres.filter(o => o.acf?.localisation === value);
    afficherOffres(filtered);
  }
});
