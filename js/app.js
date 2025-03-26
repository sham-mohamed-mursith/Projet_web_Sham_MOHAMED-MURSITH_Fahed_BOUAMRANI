import Provider from './provider.js';

// Initialisation du provider et des éléments du DOM
const provider = new Provider('http://localhost:3000');
const container = document.getElementById("characters-container");
const detailsContainer = document.getElementById("character-details");
const detailsContent = document.getElementById("details-content");
const backButton = document.getElementById("back-button");
let equipements = []; // Pour stocker les équipements

// Fonction pour récupérer tous les équipements
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

// Fonction pour afficher tous les personnages avec animation
async function afficherPersonnages() {
  try {
    // Afficher un loader pendant le chargement
    container.innerHTML = '<div class="loader"></div>';
    
    // Récupérer les personnages et équipements en parallèle
    const [personnages, equip] = await Promise.all([
      provider.getPersonnages(),
      getEquipements()
    ]);
    
    // Vider le container
    container.innerHTML = "";
    
    // Ajouter les cartes avec un délai pour l'animation
    personnages.forEach((perso, index) => {
      setTimeout(() => {
        const card = document.createElement("div");
        card.classList.add("character-card", "fade-in");
        
        // Structure améliorée de la carte
        card.innerHTML = `
          <img src="${perso.image}" alt="${perso.name}">
          <div class="character-info">
            <h2>${perso.name}</h2>
            <div class="character-meta">
              <span class="character-class">${perso.class}</span>
              <span class="character-level">Lv${perso.level}</span>
            </div>
            <div class="character-rating">
              <span>${perso.rating}</span>
              <span>⭐</span>
            </div>
          </div>
        `;
        
        // Ajouter l'event listener pour afficher les détails
        card.addEventListener("click", () => afficherDetails(perso));
        container.appendChild(card);
      }, index * 50); // Décalage pour animation en cascade
    });
  } catch (error) {
    console.error("Erreur de chargement des personnages :", error);
    container.innerHTML = `
      <div class="error-message">
        <p>Une erreur est survenue lors du chargement.</p>
        <button onclick="afficherPersonnages()">Réessayer</button>
      </div>
    `;
  }
}

// Fonction pour trouver les équipements d'un personnage
function getCharacterEquipment(perso) {
  if (!perso.equipment || !equipements.length) return [];
  return perso.equipment.map(equipId => 
    equipements.find(e => e.id === equipId)
  ).filter(e => e); // Filtrer les undefined
}

// Fonction pour afficher les détails avec plus d'informations
function afficherDetails(perso) {
  // Récupérer les équipements du personnage
  const persoEquipements = getCharacterEquipment(perso);
  
  // Construire le HTML des équipements
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
  
  // Mettre à jour le contenu des détails
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
  
  // Afficher le conteneur de détails avec animation
  container.classList.add("hidden");
  detailsContainer.classList.remove("hidden");
  
  // Ajouter la classe active pour l'animation
  setTimeout(() => {
    detailsContainer.classList.add("active");
  }, 10);
}

// Gérer le retour à la liste avec animation
backButton.addEventListener("click", () => {
  // Retirer la classe active pour déclencher l'animation de sortie
  detailsContainer.classList.remove("active");
  
  // Attendre la fin de l'animation avant de cacher l'élément
  setTimeout(() => {
    detailsContainer.classList.add("hidden");
    container.classList.remove("hidden");
  }, 300);
});

// Initialiser l'application
afficherPersonnages();

// Ajouter la gestion du "swipe" sur mobile pour revenir en arrière
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
  // Si le swipe va de gauche à droite (>100px), on retourne à la liste
  if (touchEndX - touchStartX > 100) {
    backButton.click();
  }
}