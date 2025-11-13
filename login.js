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
    const loginResp = await fetch(`${API_BASE}/auth/v1/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });

    const result = await loginResp.json();

    if (!loginResp.ok || !result.success) {
      showError(result.message || 'Identifiants invalides');
      submitBtn.disabled = false;
      submitBtn.textContent = 'S\'identifier';
      return;
    }

    // ✅ Connexion réussie
    console.log('Utilisateur connecté :', result.user);
    
    setTimeout(() => {
      localStorage.setItem('loggedIn', 'true');
      window.location.href = 'dashboard.html';
    }, 500);

  } catch (error) {
    console.error('Erreur login :', error);
    showError('Erreur de connexion. Vérifiez votre connexion internet.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'S\'identifier';
  }
});

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove('hidden');
}

// Vérifier si déjà connecté
async function checkIfLoggedIn() {
  try {
    const resp = await fetch(`${API_BASE}/wp/v2/users/me`, {
      credentials: 'include'
      
    });
    if (resp.ok) {
      window.location.href = 'dashboard.html';
    }
  } catch (error) {
    console.log('Pas connecté');
  }
}

checkIfLoggedIn();