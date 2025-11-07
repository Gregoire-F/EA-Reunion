const API_URL = "http://ealareunion.local/wp-json/wp/v2/offre";
const container = document.getElementById("offres");
const selectFiltre = document.getElementById("filtreContrat");
const selectLocalisation = document.getElementById("filtreLocalisation");
const selectDate = document.getElementById("filtreDate");
const inputRecherche = document.getElementById("recherche");

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

//  Supprime les accents et met en minuscules
function enleverAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

//  Extraire les villes uniques
function extraireLocalisations(offres) {
  return [...new Set(
    offres
      .map(o => o.acf?.localisation?.trim())
      .filter(v => v && v.length > 0)
  )];
}

//  Afficher les villes dans le select
function afficherLocalisations(localisations) {
  selectLocalisation.innerHTML = "";

  const optionAll = document.createElement("option");
  optionAll.value = "all";
  optionAll.textContent = "Toutes les localisations";
  selectLocalisation.appendChild(optionAll);

  localisations.forEach(ville => {
    const option = document.createElement("option");
    option.value = ville;
    option.textContent = ville;
    selectLocalisation.appendChild(option);
  });
}

//  Afficher les offres
function afficherOffres(offres) {
  container.innerHTML = "";

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
      <div class="flex gap-4 mt-4 justify-center">
      <button class="p-3 text-neutral-50 flex text-center bg-green-700 hover:bg-green-600 cursor-pointer rounded-lg">Postuler</button>
      <button class="p-3 flex text-center bg-red-200 text-red-500 hover:text-red-600 hover:bg-red-300 cursor-pointer rounded-lg">Sauvegarder</button>
      </div>
    `;
    container.appendChild(card);
  });
}

//  Appliquer tous les filtres et tri
function appliquerFiltres() {
  const contrat = selectFiltre.value.trim().toLowerCase();
  const ville = selectLocalisation.value.trim().toLowerCase();
  const dateTri = selectDate.value;
  const motCle = inputRecherche.value.trim();

  let filtered = toutesOffres;

  // Filtre contrat
  if (contrat !== "all") {
    filtered = filtered.filter(o => 
      enleverAccents(o.acf?.type_de_contrat || "") === enleverAccents(contrat)
    );
  }

  // Filtre ville
  if (ville !== "all") {
    filtered = filtered.filter(o => 
      enleverAccents(o.acf?.localisation || "") === enleverAccents(ville)
    );
  }

  // Recherche mot-clé (titre + description)
  if (motCle !== "") {
    const motCleNormalise = enleverAccents(motCle);
    filtered = filtered.filter(offre => {
      const acf = offre.acf || {};
      const titre = enleverAccents(offre.title.rendered);
      const description = enleverAccents(acf.description || "");
      const entreprise = enleverAccents(acf.entreprise_recruteuse || "");
      const salaire = enleverAccents(acf.salaire|| "");
      const type_de_contrat = enleverAccents(acf.type_de_contrat|| "");
      const localisation = enleverAccents(acf.localisation|| "");

      return titre.includes(motCleNormalise) || description.includes(motCleNormalise) || entreprise.includes(motCleNormalise) || salaire.includes(motCleNormalise) || type_de_contrat.includes(motCleNormalise) || localisation.includes(motCleNormalise);
    });
  }

  // Tri par date
  filtered.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateTri === "recent") return dateB - dateA;
    if (dateTri === "ancien") return dateA - dateB;
    return 0;
  });

  // Message si aucune offre
  if (filtered.length === 0) {
    container.innerHTML = `<p>Aucune offre ne correspond à vos critères.</p>`;
  } else {
    afficherOffres(filtered);
  }
}

// Écoute des filtres et barre de recherche
selectFiltre.addEventListener("change", appliquerFiltres);
selectLocalisation.addEventListener("change", appliquerFiltres);
selectDate.addEventListener("change", appliquerFiltres);
inputRecherche.addEventListener("input", appliquerFiltres);

// Menu Burger 
const burger = document.getElementById("burger");
const nav = document.getElementById("menu");

burger.addEventListener("click", () => {
  burger.classList.toggle("active"); // animation des barres
  nav.classList.toggle("open"); // slide du menu mobile
  const expanded = burger.getAttribute("aria-expanded") === "true";
  burger.setAttribute("aria-expanded", !expanded);
});