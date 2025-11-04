const API_URL = "http://ealareunion.local/wp-json/wp/v2/entreprise";
const container = document.getElementById("entreprises");

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

  entreprises.forEach(entreprise => {
    const acf = entreprise.acf || {};
    const card = document.createElement("div");
    card.className = "max-w-sm p-3 flex flex-col justify-evenly bg-white border border-gray-200 rounded-lg shadow-sm text-[clamp(0.75rem,3vw,1rem)] transition-transform duration-200 hover:scale-105 hover:shadow-lg ";

    card.innerHTML = `
      <img class="object-cover rounded mb-2 w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[350px] xl:h-[350px]" src="${acf.o3.url}" alt="${acf.entreprises}"><img>
      <h3 class="text-[clamp(1rem,3vw,1.5rem)] font-semibold mb-2">${acf.entreprises}</h3>
      <p><strong>Activités :</strong> ${acf.activites || "Non précisé"}</p>
      <p><strong>Adresse :</strong> ${acf.adresse || "Non précisé"}</p>
      <p><strong>Téléphone :</strong> ${acf.telephone || "Non précisé"}</p>
      <button class="mt-3 px-4 py-2 text-neutral-100 bg-green-700 border border-green-600 rounded hover:bg-green-600 transition-colors cursor-pointer">Externaliser</button>
    `;

    container.appendChild(card);
  });
}
    
  //   // ======== Ici on ajoute l'event pour la modal ========
  //   card.addEventListener("click", () => {
  //     const modal = document.getElementById("modal");
  //     const modalTitle = document.getElementById("modal-title");
  //     const modalContent = document.getElementById("modal-content");

  //     // Remplissage dynamique de la modal
  //     modalTitle.textContent = acf.entreprises || "Entreprise";
  //     modalContent.innerHTML = `
  //       <p><strong>Activités :</strong> ${acf.activites || "Non précisé"}</p>
  //       <p><strong>Adresse :</strong> ${acf.adresse || "Non précisé"}</p>
  //       <p><strong>Téléphone :</strong> ${acf.telephone || "Non précisé"}</p>
  //       <button class="border text-center bg-green-100">Externaliser</button>
  //     `;

  //     // Affichage modal
  //     modal.classList.remove("hidden");
  //   });
  // });

  //   // ======== Boutons pour fermer la modal ========
  //   const modal = document.getElementById("modal");
  //   document.getElementById("closeModal").addEventListener("click", () => modal.classList.add("hidden"));
  //   document.getElementById("modal-close-btn").addEventListener("click", () => modal.classList.add("hidden"));

  //   // Fermer si clic en dehors du contenu
  //   modal.addEventListener("click", e => {
  //     if (e.target === modal) modal.classList.add("hidden");

