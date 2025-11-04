const API_URL = "http://ealareunion.local/wp-json/wp/v2/entreprise";
const API_URL_EXTERNALISER = "http://ealareunion.local/wp-json/wp/v2/externaliser"
const container = document.getElementById("entreprises");
const detailContainer = document.getElementById("entreprise-detail");

// Récupération des entreprises
fetch(API_URL)
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur API : " + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log("Données reçues :", data);
    afficherEntreprises(data);
  })
  .catch(error => {
    console.error("Erreur :", error);
    container.innerHTML = "<p>Impossible de charger les entreprises.</p>";
  });

// Affichage des entreprises
function afficherEntreprises(entreprises) {
  container.innerHTML = "";
  detailContainer.classList.add("hidden"); // cacher la page des cards
  container.classList.remove("hidden");    // montrer la page par card

  entreprises.forEach(entreprise => {
    const acf = entreprise.acf || {};
    // 🔥 Nouvel ID du post externaliser à récupérer depuis ACF
    const idExternaliser = acf.externaliser_post?.ID; // champ relation ACF vers le post 'externaliser'

    const card = document.createElement("div");
    card.className = "max-w-sm p-3 flex flex-col justify-evenly bg-white border border-gray-200 rounded-lg shadow-sm text-[clamp(0.75rem,3vw,1rem)] ";

    card.innerHTML = `
      <img class="object-cover rounded mb-2 w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[350px] xl:h-[350px]" src="${acf.o3.url}" alt="${acf.entreprises}"><img>
      <h3 class="text-[clamp(1rem,3vw,1.5rem)] font-semibold mb-2">${acf.entreprises}</h3>
      <p><strong>Activités :</strong> ${acf.activites || "Non précisé"}</p>
      <p><strong>Adresse :</strong> ${acf.adresse || "Non précisé"}</p>
      <p><strong>Téléphone :</strong> ${acf.telephone || "Non précisé"}</p>
      <button data-id="${entreprise.id}" class="mt-3 px-4 py-2 text-neutral-100 bg-green-700 border border-green-600 rounded hover:bg-green-600 transition-colors cursor-pointer">Externaliser
      </button>
    `;
    container.appendChild(card);
  });

//  Nouveau — écoute le clic sur chaque bouton Externaliser
  container.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      afficherDetail(id); // 🟩 affiche les détails
    });
  });
}

function afficherDetail(id) {
  fetch(`${API_URL_EXTERNALISER}/${id}`)
    .then(res => res.json())
    .then(externaliser => {
      const acf = externaliser.acf || {};

      container.classList.add("hidden");        // cacher la liste
      detailContainer.classList.remove("hidden"); // montrer la fiche

      detailContainer.innerHTML = `
        <h2 class="text-2xl font-bold text-center mt-4 mb-10">${acf.titre_ || 'Non précisé'}</h2>
        <p><strong>Contact :</strong> ${acf.contact || "Non précisé"}</p>
        <p><strong>Adresse :</strong> ${acf.adresse || "Non précisé"}</p>
        <p><strong>Site Internet :</strong> ${acf.site_internet || "Non précisé"}</p>
        <p><strong>Présentation :</strong> ${acf.presentation || "Non précisé"}</p>
        <p><strong>Activités externalisables :</strong> ${acf.activites_externalisables || "Non précisé"}</p>

        ${acf.lien_externe ? `
          <a href="${acf.lien_externe}" target="_blank"
             class="inline-block mt-4 bg-green-700 text-neutral-100 px-4 py-2 rounded hover:bg-green-600 transition">
             Accéder au site externe
          </a>
        ` : ""}
        <button id="retour" class="mt-6 cursor-pointer block hover:underline">← Retour à la liste</button>
      `;

      // 🟩 Bouton de retour sur la page EA
      document.getElementById("retour").addEventListener("click", () => {
        detailContainer.classList.add("hidden");
        container.classList.remove("hidden");
      });
    })
    .catch(err => console.error("Erreur de chargement :", err));
}
