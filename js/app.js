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

        // Ajout de l'écouteur pour les détails
        card.addEventListener("click", async () => await afficherDetails(perso));
        container.appendChild(card);
      }, index * 50); // Animation en cascade
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

// Fonction pour trouver les équipements d’un personnage
function getCharacterEquipment(perso) {
  if (!perso.equipment || !equipements.length) return [];
  return perso.equipment.map(equipId =>
    equipements.find(e => e.id === equipId)
  ).filter(e => e);
}

// Fonction pour afficher les détails
async function afficherDetails(perso) {
  if (!equipements.length) {
    await getEquipements(); // S'assurer que les équipements sont chargés
  }

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

  // Affichage des infos
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

  ajouterNotation(perso);

  container.classList.add("hidden");
  detailsContainer.classList.remove("hidden");

  setTimeout(() => {
    detailsContainer.classList.add("active");
  }, 10);
}

// Gérer le retour
backButton.addEventListener("click", () => {
  detailsContainer.classList.remove("active");
  setTimeout(() => {
    detailsContainer.classList.add("hidden");
    container.classList.remove("hidden");
  }, 300);
});

// Ajout de notation
function ajouterNotation(personnage) {
  const notationHTML = `
    <div class="notation">
      <h3>Noter ${personnage.name}</h3>
      <label for="rating-input">Votre note (1 à 5) :</label>
      <input type="number" id="rating-input" min="1" max="5" step="0.1" value="${personnage.rating}">
      <button id="valider-note">Valider la note</button>
    </div>
  `;

  detailsContent.insertAdjacentHTML("beforeend", notationHTML);

  document.getElementById("valider-note").addEventListener("click", async () => {
    const nouvelleNote = parseFloat(document.getElementById("rating-input").value);
    if (nouvelleNote >= 1 && nouvelleNote <= 5) {
      try {
        await provider.updatePersonnageRating(personnage.id, nouvelleNote);
        alert("Note mise à jour !");
        window.location.reload();
      } catch (error) {
        alert("Erreur lors de la mise à jour de la note.");
      }
    } else {
      alert("Merci d'entrer une note entre 1 et 5.");
    }
  });
}

// Lancement initial
afficherPersonnages();
