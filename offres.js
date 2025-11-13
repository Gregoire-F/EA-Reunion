import { ROUTES } from './api.js';
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

    toutesLocalisations = extraireLocalisations(offres);
    afficherLocalisations(toutesLocalisations);

    afficherOffres(toutesOffres);
  })
  .catch(error => {
    console.error("Erreur :", error);
    container.innerHTML = "<p>Impossible de charger les offres.</p>";
  });

// Supprime les accents et met en minuscules
function enleverAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Extraire les villes uniques
function extraireLocalisations(offres) {
  return [...new Set(
    offres
      .map(o => o.acf?.localisation?.trim())
      .filter(v => v && v.length > 0)
  )];
}

// Afficher les villes dans le select
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
        <a href="postuler.html?offreId=${offre.id}&title=${encodeURIComponent(offre.title.rendered)}" class="btn-postuler p-3 text-neutral-50 flex text-center bg-green-700 hover:bg-green-600 cursor-pointer rounded-lg" data-offre='${JSON.stringify(offre)}'>Postuler</a>
        <button data-job-id="${offre.id}" class="save-job-btn p-3 flex text-center bg-red-200 text-red-500 hover:text-red-600 hover:bg-red-300 cursor-pointer rounded-lg">Sauvegarder</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Appliquer les filtres
function appliquerFiltres() {
  const contrat = selectFiltre.value.trim().toLowerCase();
  const ville = selectLocalisation.value.trim().toLowerCase();
  const dateTri = selectDate.value;
  const motCle = inputRecherche.value.trim();

  let filtered = toutesOffres;

  if (contrat !== "all") {
    filtered = filtered.filter(o => 
      enleverAccents(o.acf?.type_de_contrat || "") === enleverAccents(contrat)
    );
  }

  if (ville !== "all") {
    filtered = filtered.filter(o => 
      enleverAccents(o.acf?.localisation || "") === enleverAccents(ville)
    );
  }

  if (motCle !== "") {
    const motCleNormalise = enleverAccents(motCle);
    filtered = filtered.filter(offre => {
      const acf = offre.acf || {};
      return [offre.title.rendered, acf.description, acf.entreprise_recruteuse, acf.salaire, acf.type_de_contrat, acf.localisation]
        .some(field => enleverAccents(field || "").includes(motCleNormalise));
    });
  }

  filtered.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateTri === "recent") return dateB - dateA;
    if (dateTri === "ancien") return dateA - dateB;
    return 0;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p>Aucune offre ne correspond à vos critères.</p>`;
  } else {
    afficherOffres(filtered);
  }
}

selectFiltre.addEventListener("change", appliquerFiltres);
selectLocalisation.addEventListener("change", appliquerFiltres);
selectDate.addEventListener("change", appliquerFiltres);
inputRecherche.addEventListener("input", appliquerFiltres);

// Menu Burger
const burger = document.getElementById("burger");
const nav = document.getElementById("menu");
burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  nav.classList.toggle("open");
  const expanded = burger.getAttribute("aria-expanded") === "true";
  burger.setAttribute("aria-expanded", !expanded);
});

// Postuler
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-postuler')) {
    const offre = JSON.parse(e.target.dataset.offre);
    localStorage.setItem('offreSelectionnee', JSON.stringify(offre));
    window.location.href = 'postuler.html';
  }
});

// Délégation d'événement pour Sauvegarder
document.addEventListener('click', async (e) => {

  const btn = e.target.closest('.save-job-btn');
  if (!btn) return;

  const jobId = btn.dataset.jobId;
  if (!jobId) {
    console.error('Job ID manquant');
    return;
  }

  btn.textContent = 'Sauvegarde...';
  btn.disabled = true;

  try {
    const response = await fetch(`${ROUTES.FAVORIS}`, { //ROUTES.FAVORIS crée dans api.js
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ job_id: jobId })
    });

    if (!response.ok) throw new Error('Erreur API');

    btn.textContent = 'Sauvegardée ✅';
    btn.classList.remove('bg-red-200', 'text-red-500');
    btn.classList.add('bg-green-200', 'text-green-600');

  } catch (error) {
    console.error('Erreur de sauvegarde :', error);
    btn.textContent = 'Erreur ❌';
    btn.disabled = false;
  }
});
