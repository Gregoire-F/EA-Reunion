const offreContainer = document.getElementById('offre-container');
const offreJSON = localStorage.getItem('offreSelectionnee');

if (!offreJSON) {
  offreContainer.innerHTML = '<p>Aucune offre sélectionnée.</p>';
} else {
  const offre = JSON.parse(offreJSON);
  const acf = offre.acf || {};

  offreContainer.innerHTML = `
    <h2 class="font-bold text-xl mb-2">${offre.title.rendered}</h2>
    <p><strong>Entreprise :</strong> ${acf.entreprise_recruteuse || "Non précisé"}</p>
    <p><strong>Description :</strong> ${acf.description || "Non précisé"}</p>
    <p><strong>Salaire :</strong> ${acf.salaire || "Non précisé"}</p>
    <p><strong>Type de contrat :</strong> ${acf.type_de_contrat || "Non précisé"}</p>
    <p><strong>Lieu :</strong> ${acf.localisation || "Non précisé"}</p>
  `;
}

const form = document.getElementById("formPostuler");
const result = document.getElementById("formResult");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // Réinitialiser les messages d'erreur
  const errorMessages = form.querySelectorAll('span[id^="error-"]');
  errorMessages.forEach(span => {
    span.textContent = '';
    span.classList.add('hidden');
  });

  // Vérification des champs obligatoires
  const requiredFields = form.querySelectorAll('[required]');
  let allFilled = true;

  requiredFields.forEach(field => {
    const errorSpan = document.getElementById(`error-${field.name}`);
    if (!field.value) {
      allFilled = false;
      errorSpan.textContent = `${field.placeholder} est requis.`;
      errorSpan.classList.remove('hidden');
    }
  });

  if (!allFilled) {
    return; // Ne pas envoyer le formulaire si des champs sont manquants
  }

  result.textContent = "Envoi en cours...";

  const fd = new FormData(form);

  try {
    console.log("Données envoyées:", Object.fromEntries(fd.entries())); // Affiche les données envoyées
    
    const resp = await fetch(
      "http://ealareunion.local/wp-json/postuler/v1/send",
      {
        method: "POST",
        body: fd,
        credentials: 'include',
        mode: 'cors'
      }
    );
    
    // Log de la réponse complète
    console.log("Status:", resp.status);
    console.log("Headers:", resp.headers);
    
    const json = await resp.json();
    console.log("Réponse:", json);
    
    if (resp.ok && json.success) {
      result.className = "mt-4 text-green-600";
      result.textContent = "Candidature envoyée. Merci !";
      form.reset();
    } else {
      result.className = "mt-4 text-red-600";
      result.textContent = json.message || "Erreur lors de l'envoi.";
      console.error(json);
    }
  } catch (err) {
    console.error("Erreur détaillée:", err);
    result.className = "mt-4 text-red-600";
    result.textContent = "Erreur réseau. Réessayez. " + err.message;
    console.error(err);
  }
});
