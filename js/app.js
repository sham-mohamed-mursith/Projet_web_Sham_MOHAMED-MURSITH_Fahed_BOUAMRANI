import Provider from './provider.js';

const provider = new Provider('http://localhost:3000');
const container = document.getElementById("characters-container");
const detailsContainer = document.getElementById("character-details");
const detailsContent = document.getElementById("details-content");
const backButton = document.getElementById("back-button");
const voirFavorisBtn = document.getElementById("voir-favoris");
const retourAccueilBtn = document.getElementById("retour-accueil");
let equipements = [];
let modeFavoris = false; // Pour savoir si on affiche les favoris

async function getEquipements() {
  try {
    const data = await provider.getEquipements();
    equipements = data;
    return data;
  } catch (error) {
    console.error("Erreur de chargement des équipements :", error);
    return [];
  }
}

async function afficherPersonnages(personnagesFiltre = null) {
  try {
    container.innerHTML = '<div class="loader"></div>';
    const [personnages, equip] = await Promise.all([provider.getPersonnages(), getEquipements()]);
    const data = personnagesFiltre || personnages;
    container.innerHTML = "";

    data.forEach((perso, index) => {
      setTimeout(() => {
        const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
        const isFavori = favoris.includes(perso.id);
        const starClass = isFavori ? 'fa-solid' : 'fa-regular';

        const card = document.createElement("div");
        card.classList.add("character-card", "fade-in");
        card.innerHTML = `
          <img src="${perso.image}" alt="${perso.name}">
          <div class="character-info">
            <h2>${perso.name}</h2>
            <div class="character-meta">
              <span class="character-class">${perso.class}</span>
              <span class="character-level">Lv${perso.level}</span>
            </div>
            <div class="character-rating">
              <span>${perso.rating}</span> ⭐
            </div>
            <button class="favori-btn" data-id="${perso.id}">
              <i class="${starClass} fa-star"></i> Favori
            </button>
          </div>
        `;

        card.querySelector('img').addEventListener("click", () => afficherDetails(perso));

        const favoriBtn = card.querySelector('.favori-btn');
        favoriBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleFavori(favoriBtn, perso.id);
        });

        container.appendChild(card);
      }, index * 50);
    });

  } catch (error) {
    console.error("Erreur de chargement des personnages :", error);
    container.innerHTML = `<div class="error-message">
      <p>Une erreur est survenue lors du chargement.</p>
      <button onclick="afficherPersonnages()">Réessayer</button>
    </div>`;
  }
}

function getCharacterEquipment(perso) {
  if (!perso.equipment || !equipements.length) return [];
  return perso.equipment.map(equipId =>
    equipements.find(e => e.id === equipId)
  ).filter(e => e);
}

function afficherDetails(perso) {
  const persoEquipements = getCharacterEquipment(perso);
  let equipementsHTML = '';

  if (persoEquipements.length > 0) {
    equipementsHTML = `
      <div class="equipment-list">
        <h3>Équipements (${persoEquipements.length})</h3>
        ${persoEquipements.map(equip => `
          <div class="equipment-item">
            <div>
              <strong>${equip.name}</strong>
              ${equip.damage ? `<p>Dégâts: ${equip.damage}</p>` : ''}
              ${equip.defense ? `<p>Défense: ${equip.defense}</p>` : ''}
              ${equip.effect ? `<p>Effet: ${equip.effect}</p>` : ''}
            </div>
            <span class="equipment-type">${equip.type}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  detailsContent.innerHTML = `
    <img src="${perso.image}" alt="${perso.name}" class="character-image">
    <div class="character-details-info">
      <h2>${perso.name}</h2>
      <p><strong>Classe:</strong> ${perso.class}</p>
      <p><strong>Niveau:</strong> ${perso.level}</p>
      <p><strong>Note:</strong> ${perso.rating} ⭐</p>
      ${equipementsHTML}
    </div>
  `;

  container.classList.add("hidden");
  detailsContainer.classList.remove("hidden");

  setTimeout(() => {
    detailsContainer.classList.add("active");
  }, 10);
}

function toggleFavori(button, id) {
  let favoris = JSON.parse(localStorage.getItem('favoris')) || [];
  const index = favoris.indexOf(id);

  if (index === -1) {
    favoris.push(id);
    button.innerHTML = '<i class="fa-solid fa-star"></i> Favori';
  } else {
    favoris.splice(index, 1);
    button.innerHTML = '<i class="fa-regular fa-star"></i> Favori';
  }
  localStorage.setItem('favoris', JSON.stringify(favoris));

  // Si on est en mode favoris et qu'on retire => actualise
  if (modeFavoris) afficherFavoris();
}

// Bouton voir favoris
voirFavorisBtn.addEventListener("click", () => {
  modeFavoris = true;
  afficherFavoris();
});

// Bouton retour accueil
retourAccueilBtn.addEventListener("click", () => {
  modeFavoris = false;
  afficherPersonnages();
});

function afficherFavoris() {
  const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
  if (favoris.length === 0) {
    container.innerHTML = `<p class="empty-favoris">Aucun favori enregistré.</p>`;
    return;
  }
  provider.getPersonnages().then(personnages => {
    const favorisPersos = personnages.filter(p => favoris.includes(p.id));
    afficherPersonnages(favorisPersos);
  });
}

backButton.addEventListener("click", () => {
  detailsContainer.classList.remove("active");
  setTimeout(() => {
    detailsContainer.classList.add("hidden");
    container.classList.remove("hidden");
  }, 300);
});

afficherPersonnages();

// Swipe mobile
let touchStartX = 0;
let touchEndX = 0;

detailsContainer.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

detailsContainer.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (touchEndX - touchStartX > 100) {
    backButton.click();
  }
}
