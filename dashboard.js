const API_BASE = "http://ealareunion.local/wp-json";

// ========== FONCTION POUR OBTENIR LE TOKEN JWT ==========
function getAuthHeader() {
  const token = localStorage.getItem("jwt_token");
  if (!token) {
    window.location.href = "login.html";
    return null;
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// ========== GESTION DU MENU MOBILE ==========
function ouvrirMenu() {
  document.getElementById("sidebar").classList.add("translate-x-0");
  document.getElementById("sidebar").classList.remove("-translate-x-full");
  document.getElementById("overlay").classList.remove("hidden");
}

function fermerMenu() {
  document.getElementById("sidebar").classList.add("-translate-x-full");
  document.getElementById("sidebar").classList.remove("translate-x-0");
  document.getElementById("overlay").classList.add("hidden");
}

// ========== GESTION DES ONGLETS ==========
function activerOnglet(onglet) {
  // Masquer tous les onglets
  document.querySelectorAll('[id^="section-"]').forEach((el) => {
    el.classList.add("hidden");
  });

  // Afficher l'onglet actif
  document.getElementById(`section-${onglet}`).classList.remove("hidden");

  // Mettre à jour la navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("nav-active");
  });
  e.target.closest("button").classList.add("nav-active");

  // Fermer le menu mobile
  fermerMenu();
}

// ========== CHARGE LE PROFIL AU DÉMARRAGE ==========
async function chargerProfil() {
  try {
    const headers = getAuthHeader();
    if (!headers) return;

    const response = await fetch(`${API_BASE}/wp/v2/users/me`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      console.error("Erreur authentification, redirection vers login");
      localStorage.removeItem("jwt_token");
      window.location.href = "login.html";
      return;
    }

    const user = await response.json();

    document.getElementById(
      "welcome-title"
    ).textContent = `Bienvenue ${user.name}`;
    document.getElementById("profile-prenom").textContent =
      user.first_name || "-";
    document.getElementById("profile-nom").textContent = user.last_name || "-";
    document.getElementById("profile-email").textContent = user.email;

    document.getElementById("edit-prenom").value = user.first_name || "";
    document.getElementById("edit-nom").value = user.last_name || "";
    document.getElementById("edit-email").value = user.email || "";

    chargerFavoris();
    chargerCV();
    chargerConversations();
  } catch (error) {
    console.error("Erreur chargement profil :", error);
    localStorage.removeItem("jwt_token");
    window.location.href = "login.html";
  }
}

// ========== PLACEHOLDER FUNCTIONS ==========
function chargerFavoris() {
  console.log("Favoris chargés");
}

function chargerCV() {
  console.log("CV chargé");
}

function chargerConversations() {
  console.log("Conversations chargées");
}

// ========== DÉCONNEXION ==========
document.getElementById("btn-deconnexion").addEventListener("click", () => {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
});

// ========== INITIALISATION AU CHARGEMENT DE LA PAGE ==========
document.addEventListener("DOMContentLoaded", () => {
  // initUI();
  activerOnglet("welcome"); // Démarrer sur les favoris
  chargerProfil();
});
