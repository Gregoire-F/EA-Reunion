const API_BASE = 'http://ealareunion.local/wp-json';

// ========== FONCTION POUR OBTENIR LE TOKEN JWT ==========
function getAuthHeader() {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    window.location.href = 'login.html';
    return null;
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

// ========== CHARGE LE PROFIL AU DÉMARRAGE ==========
async function chargerProfil() {
  try {
    const headers = getAuthHeader();
    if (!headers) return;

    const response = await fetch(`${API_BASE}/wp/v2/users/me`, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      console.error('Erreur authentification, redirection vers login');
      localStorage.removeItem('jwt_token');
      window.location.href = 'login.html';
      return;
    }

    const user = await response.json();
    
    document.getElementById('welcome-title').textContent = `Bienvenue ${user.name}`;
    document.getElementById('profile-prenom').textContent = user.first_name || '-';
    document.getElementById('profile-nom').textContent = user.last_name || '-';
    document.getElementById('profile-email').textContent = user.email;
    
    document.getElementById('edit-prenom').value = user.first_name || '';
    document.getElementById('edit-nom').value = user.last_name || '';
    document.getElementById('edit-email').value = user.email || '';

    chargerFavoris();
    chargerCV();
    chargerConversations();

  } catch (error) {
    console.error('Erreur chargement profil :', error);
    localStorage.removeItem('jwt_token');
    window.location.href = 'login.html';
  }
}

// ========== DÉCONNEXION ==========
document.getElementById('btn-deconnexion').addEventListener('click', () => {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('loggedIn');
  window.location.href = 'index.html';
});

// ========== INITIALISATION AU CHARGEMENT DE LA PAGE ==========
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  activerOnglet('favoris'); // Démarrer sur les favoris
  chargerProfil();
});