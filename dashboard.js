const API_BASE = 'http://ealareunion.local/wp-json';

// ========== FONCTION POUR ACTIVER UN ONGLET ==========
function activerOnglet(nom) {
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const btn = document.querySelector(`.sidebar-item[data-tab="${nom}"]`);
  const content = document.getElementById(nom);
  if (btn) btn.classList.add('active');
  if (content) content.classList.add('active');
  
  document.querySelector('aside')?.classList.remove('active');
  document.getElementById('sidebar-overlay')?.classList.remove('active');
  document.getElementById('burger-menu')?.classList.remove('active');
}

// ========== INITIALISATION UI : Burger, Overlay, Sidebar Items ==========
function initUI() {
  const burgerMenu = document.getElementById('burger-menu');
  const aside = document.querySelector('aside');
  const overlay = document.getElementById('sidebar-overlay');

  function closeSidebar() {
    burgerMenu?.classList.remove('active');
    aside?.classList.remove('active');
    overlay?.classList.remove('active');
  }

  function openSidebar() {
    burgerMenu?.classList.add('active');
    aside?.classList.add('active');
    overlay?.classList.add('active');
  }

  burgerMenu?.addEventListener('click', () => {
    if (aside?.classList.contains('active')) closeSidebar();
    else openSidebar();
  });

  overlay?.addEventListener('click', closeSidebar);

  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      const tabName = item.dataset.tab;
      activerOnglet(tabName);
      if (window.innerWidth < 768) closeSidebar();
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) closeSidebar();
  });
}

// ========== CHARGE LE PROFIL AU DÉMARRAGE ==========
async function chargerProfil() {
  try {
    const response = await fetch(`${API_BASE}/wp/v2/users/me`, {
      credentials: 'include'
    });

    if (!response.ok) {
      window.location.href = 'index.html';
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
  }
}

// ========== MON PROFIL - MODIFIER ==========
document.getElementById('btn-modifier-profil').addEventListener('click', () => {
  document.getElementById('form-modifier-profil').classList.toggle('hidden');
});

document.getElementById('btn-annuler').addEventListener('click', () => {
  document.getElementById('form-modifier-profil').classList.add('hidden');
});

document.getElementById('formModifierProfil').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const prenom = document.getElementById('edit-prenom').value;
  const nom = document.getElementById('edit-nom').value;
  const email = document.getElementById('edit-email').value;

  try {
    // TODO: Implémenter la mise à jour du profil côté serveur
    alert('✅ Profil mis à jour (à implémenter côté serveur)');
    document.getElementById('form-modifier-profil').classList.add('hidden');
  } catch (error) {
    alert('Erreur lors de la mise à jour');
  }
});

// ========== MES FAVORIS ==========
async function chargerFavoris() {
  try {
    const response = await fetch(`${API_BASE}/favoris/v1/saved-jobs`, {
      credentials: 'include'
    });

    if (!response.ok) return;

    const data = await response.json();
    const container = document.getElementById('favoris-container');

    if (!data.favoris || data.favoris.length === 0) {
      container.innerHTML = '<p class="text-gray-600">Aucune offre sauvegardée.</p>';
      return;
    }

    container.innerHTML = data.favoris.map(offre => {
      const acf = offre.acf || {};
      return `
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-700">
          <div class="flex justify-between items-start mb-4 max-sm:flex-col">
            <div class="flex-1">
              <h3 class="text-xl font-bold mb-2">${offre.title.rendered}</h3>
              <p class="text-sm text-gray-600"><strong>Entreprise:</strong> ${acf.entreprise_recruteuse || '-'}</p>
              <p class="text-sm text-gray-600"><strong>Localisation:</strong> ${acf.localisation || '-'}</p>
              <p class="text-sm text-gray-600"><strong>Type:</strong> ${acf.type_de_contrat || '-'}</p>
            </div>
            <button class="btn-supprimer-favori text-red-500 hover:text-red-700 text-2xl ml-4 max-sm:ml-0 max-sm:mt-4" data-offre-id="${offre.id}">
              ❌
            </button>
          </div>
          <a href="postuler.html?offreId=${offre.id}&title=${encodeURIComponent(offre.title.rendered)}" class="inline-block bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 text-sm">
            📝 Postuler
          </a>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.btn-supprimer-favori').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const offreId = parseInt(btn.dataset.offreId);
        if (!confirm('Supprimer ce favori ?')) return;

        try {
          const resp = await fetch(`${API_BASE}/favoris/v1/remove`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ offre_id: offreId })
          });

          if (resp.ok) {
            chargerFavoris();
          }
        } catch (error) {
          console.error('Erreur suppression :', error);
        }
      });
    });

  } catch (error) {
    console.error('Erreur chargement favoris :', error);
  }
}

// ========== MES CV ==========
async function chargerCV() {
  try {
    const resp = await fetch(`${API_BASE}/dashboard/v1/list-cv`, {
      credentials: 'include'
    });
    if (!resp.ok) {
      document.getElementById('cv-container').innerHTML = '<p class="text-gray-600">Impossible de charger les CV.</p>';
      return;
    }
    const data = await resp.json();
    const container = document.getElementById('cv-container');

    if (!data.cvs || data.cvs.length === 0) {
      container.innerHTML = '<p class="text-gray-600">Aucun CV uploadé.</p>';
      return;
    }

    container.innerHTML = data.cvs.map(cv => `
      <div class="bg-white rounded-lg shadow p-4 flex justify-between items-center max-sm:flex-col">
        <div class="flex-1">
          <div class="text-sm text-gray-600">${new Date(cv.date).toLocaleDateString()}</div>
          <div class="font-semibold">${cv.filename || cv.title || 'CV'}</div>
          <a class="text-green-700 text-sm" href="${cv.url}" target="_blank" rel="noopener">Télécharger</a>
        </div>
        <button class="btn-supprimer-cv bg-red-100 text-red-600 px-3 py-1 rounded text-sm max-sm:mt-4 max-sm:w-full" data-id="${cv.id}">Supprimer</button>
      </div>
    `).join('');

    container.querySelectorAll('.btn-supprimer-cv').forEach(btn => {
      btn.addEventListener('click', async () => {
        const attachment_id = Number(btn.dataset.id);
        if (!confirm('Supprimer ce CV ?')) return;

        try {
          const r = await fetch(`${API_BASE}/dashboard/v1/remove-cv`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attachment_id })
          });
          const jr = await r.json();
          if (r.ok && jr.success) {
            chargerCV();
            alert('CV supprimé');
          } else {
            alert(jr.message || 'Erreur suppression');
          }
        } catch (err) {
          console.error(err);
          alert('Erreur réseau');
        }
      });
    });

  } catch (err) {
    console.error('chargerCV', err);
    document.getElementById('cv-container').innerHTML = '<p class="text-red-600">Erreur chargement CV.</p>';
  }
}

document.getElementById('formUploadCV').addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = document.getElementById('cv-file').files[0];
  const name = document.getElementById('cv-name').value || '';

  if (!file) {
    alert('Veuillez sélectionner un CV');
    return;
  }

  try {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('name', name);

    const resp = await fetch(`${API_BASE}/dashboard/v1/upload-cv`, {
      method: 'POST',
      credentials: 'include',
      body: fd
    });

    const result = await resp.json();
    if (resp.ok && result.success) {
      alert('CV uploadé');
      document.getElementById('formUploadCV').reset();
      chargerCV();
    } else {
      alert(result.message || 'Erreur upload');
    }
  } catch (err) {
    console.error('upload CV', err);
    alert('Erreur réseau');
  }
});

// ========== MESSAGERIE ==========
async function chargerConversations() {
  document.getElementById('conversations-list').innerHTML = `
    <p class="p-4 text-gray-500 text-sm">Aucune conversation pour le moment.</p>
  `;
}

// ========== DÉCONNEXION ==========
document.getElementById('btn-deconnexion').addEventListener('click', async () => {
  try {
    // Accéder à wp-login.php pour la déconnexion
    window.location.href = 'http://ealareunion.local/wp-login.php?action=logout&redirect_to=' + encodeURIComponent(window.location.origin);
  } catch (error) {
    window.location.href = 'index.html';
  }
});

// ========== INITIALISATION AU CHARGEMENT DE LA PAGE ==========
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  activerOnglet('favoris'); // Démarrer sur les favoris
  chargerProfil();
});