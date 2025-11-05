const API_URL = "http://ealareunion.local/wp-json/wp/v2/entreprise"; 
const API_URL_EXTERNALISER = "http://ealareunion.local/wp-json/wp/v2/externaliser";
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
    console.log("✅ Données entreprises :", data);
    afficherEntreprises(data);
  })
  .catch(error => {
    console.error("Erreur :", error);
    container.innerHTML = "<p>Impossible de charger les entreprises.</p>";
  });

//  Affichage des entreprises
function afficherEntreprises(entreprises) {
  container.innerHTML = "";
  detailContainer.classList.add("hidden");
  container.classList.remove("hidden");

  entreprises.forEach(entreprise => {
    const acf = entreprise.acf || {};

    // Gère tous les formats possibles pour le champ ACF "externaliser_post"
    const idExternaliser = Array.isArray(acf.externaliser_post)
      ? acf.externaliser_post[0]
      : acf.externaliser_post?.ID || acf.externaliser_post || null;

    console.log("🧩 ID externaliser détecté pour", acf.entreprises, ":", idExternaliser);

    const card = document.createElement("div");
    card.className =
      "max-w-sm p-3 flex flex-col justify-evenly bg-white border border-gray-200 rounded-lg shadow-sm text-[clamp(0.75rem,3vw,1rem)]";

    card.innerHTML = `
      <img class="object-cover rounded mb-2 w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[350px] xl:h-[350px]" 
           src="${acf.o3?.url || ''}" 
           alt="${acf.entreprises}">
      <h3 class="text-[clamp(1rem,3vw,1.5rem)] font-semibold mb-2">${acf.entreprises}</h3>
      <p><strong>Activités :</strong> ${acf.activites || "Non précisé"}</p>
      <p><strong>Adresse :</strong> ${acf.adresse || "Non précisé"}</p>
      <p><strong>Téléphone :</strong> ${acf.telephone || "Non précisé"}</p>

      ${
        idExternaliser
          ? `<button data-id="${idExternaliser}" 
                     class="mt-3 px-4 py-2 text-neutral-100 bg-green-700 border border-green-600 rounded hover:bg-green-600 transition-colors cursor-pointer">
               Externaliser
             </button>`
          : `<p class="text-gray-400 italic mt-2">Aucune externalisation liée</p>`
      }
    `;

    container.appendChild(card);
  });

  //  Active les boutons Externaliser
  container.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      console.log("📡 Clic sur le bouton externaliser → ID :", id);
      afficherDetail(id);
    });
  });
}

//  Affiche la fiche "externaliser"
function afficherDetail(id) {
  fetch(`${API_URL_EXTERNALISER}/${id}`)
    .then(res => res.json())
    .then(externaliser => {
      console.log("📄 Données externaliser :", externaliser);

      const acf = externaliser.acf || {};

      container.classList.add("hidden");
      detailContainer.classList.remove("hidden");

      detailContainer.innerHTML = `
        <div class="mb-6 mt-6 mx-auto max-w-2xl bg-green-700 text-neutral-100 p-6 rounded-lg shadow-md">
        <h2 class="text-[clamp(1rem,3vw,2rem)] font-bold text-center mt-4">${acf.titre_ || "Non précisé"}</h2>
        <hr>
        <p class="text-center mb-4 mt-2">${acf.valeur || "Non précisé"}</p>
        <p><strong>Contact :</strong> ${acf.contact || "Non précisé"}</p>
        <p><strong>Adresse :</strong> ${acf.adresse || "Non précisé"}</p>
        <p><strong>Site Internet : </strong>${acf.site_internet
        ? `<a href="${acf.site_internet}" target="_blank" rel="noopener noreferrer" class="hover:underline">
          ${acf.site_internet}
        </a>`
        : "Non précisé"}</p>
        </div>
        <div class="mb-6 mt-6 mx-auto max-w-2xl bg-neutral-100 p-6 rounded-lg shadow-md">
        <p><strong>Présentation :</strong> ${acf.presentation || "Non précisé"}</p>
        <p class="mt-2"><strong>Dirigeant :</strong> ${acf.dirigeant || "Non précisé"}</p>
        </div>
        <div class="mb-6 mt-6 mx-auto max-w-2xl bg-neutral-100 p-6 rounded-lg shadow-md">
        <p><strong>Activités externalisables :</strong> ${acf.activites_externalisables || "Non précisé"}</p>
        </div>
        <button id="retour" class="mt-6 cursor-pointer block hover:underline">← Retour à la liste</button>
      `;

      document.getElementById("retour").addEventListener("click", () => {
        detailContainer.classList.add("hidden");
        container.classList.remove("hidden");
      });
    })
    .catch(err => console.error("Erreur de chargement :", err));
}
