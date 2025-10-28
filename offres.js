const API_URL = "http://ealareunion.local/wp-json/wp/v2/pages"; 

async function chargerOffres() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Erreur API : " + res.status);
    
    const offres = await res.json();
    const container = document.getElementById("offres");

      offres.forEach(offre => {
        const bloc = document.createElement("div");
        bloc.className = "bg-white p-4 rounded-lg shadow";

        bloc.innerHTML = `
          <h2 class="text-xl font-semibold mb-2">${offre.title.rendered}</h2>
          <p><strong>Localisation :</strong> ${offre.acf.location || "Non précisée"}</p>
          <p><strong>Contrat :</strong> ${offre.acf.contract_type || "Non précisé"}</p>
          <p><strong>Salaire :</strong> ${offre.acf.salary || "Non précisé"}</p>
        `;

        container.appendChild(bloc);
      });

  } catch (error) {
    console.error("Erreur lors du fetch :", error);
  }
}

chargerOffres();