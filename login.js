const API_BASE = 'http://ealareunion.local/wp-json';

const loginForm = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
const errorMsg = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    showError('Veuillez remplir tous les champs');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Connexion en cours...';
  errorMsg.classList.add('hidden');

  try {
    // ✅ ÉTAPE 1 : Générer le token (POST /token)
    const loginResponse = await fetch(`${API_BASE}/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const loginData = await loginResponse.json();

    // ✅ Vérifier si la connexion a échoué
    if (!loginResponse.ok || !loginData.token) {
      throw new Error(loginData.message || 'Identifiants invalides');
    }

    // ✅ ÉTAPE 2 : Stocker le token
    const token = loginData.token;
    localStorage.setItem('jwt_token', token);
    console.log('Token stocké :', token);

    // ✅ ÉTAPE 3 : Valider le token (optionnel, pour vérifier)
    const validateResponse = await fetch(`${API_BASE}/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const validateData = await validateResponse.json();
    
    if (!validateResponse.ok) {
      throw new Error('Token validation échouée');
    }

    console.log('✅ Utilisateur connecté :', validateData);

    // ✅ ÉTAPE 4 : Redirection
    setTimeout(() => {
      localStorage.setItem('loggedIn', 'true');
      window.location.href = 'dashboard.html';
    }, 500);

  } catch (error) {
    console.error('Erreur login :', error);
    showError(error.message || 'Erreur de connexion. Vérifiez vos identifiants.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'S\'identifier';
  }
});

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove('hidden');
}

// ✅ Vérifier si déjà connecté (SEULEMENT sur login.html)
async function checkIfLoggedIn() {
  // Vérifier qu'on est bien sur login.html
  if (!window.location.pathname.includes('login.html')) {
    return;
  }

  try {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
      console.log('Pas de token stocké');
      return;
    }

    const resp = await fetch(`${API_BASE}/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (resp.ok) {
      console.log('Token valide, redirection vers dashboard');
      window.location.href = 'dashboard.html';
    } else {
      localStorage.removeItem('jwt_token');
      console.log('Token invalide');
    }
  } catch (error) {
    console.log('Erreur vérification token :', error);
    localStorage.removeItem('jwt_token');
  }
}

// Vérifier à la première visite
checkIfLoggedIn();