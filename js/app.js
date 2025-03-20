import Provider from './provider.js';

const provider = new Provider('http://localhost:3000');
const container = document.getElementById("characters-container");
const detailsContainer = document.getElementById("character-details");
const detailsContent = document.getElementById("details-content");
const backButton = document.getElementById("back-button");

// Fonction pour afficher tous les personnages
async function afficherPersonnages() {
    try {
        const personnages = await provider.getPersonnages();

        container.innerHTML = ""; // Réinitialiser

        personnages.forEach(perso => {
            const card = document.createElement("div");
            card.classList.add("character-card");
            card.innerHTML = `
                <h2>${perso.name}</h2>
                <p>Classe : ${perso.class}</p>
                <p>Niveau : ${perso.level}</p>
                <p>Note : ${perso.rating} ⭐</p>
            `;

            // Événement au clic pour afficher les détails
            card.addEventListener("click", () => afficherDetails(perso));

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Erreur de chargement des personnages :", error);
        container.innerHTML = "<p>Erreur lors du chargement.</p>";
    }
}

// Fonction pour afficher les détails d'un personnage en plein écran
function afficherDetails(perso) {
    detailsContent.innerHTML = `
        <h2>${perso.name}</h2>
        <p><strong>Classe :</strong> ${perso.class}</p>
        <p><strong>Niveau :</strong> ${perso.level}</p>
        <p><strong>Note :</strong> ${perso.rating} ⭐</p>
    `;

    container.classList.add("hidden"); // Cacher la liste des personnages
    detailsContainer.classList.remove("hidden"); // Afficher les détails
}

// Fonction pour revenir à la liste des personnages
backButton.addEventListener("click", () => {
    detailsContainer.classList.add("hidden"); // Cacher les détails
    container.classList.remove("hidden"); // Réafficher la liste des personnages
});

// Charger les personnages au démarrage
afficherPersonnages();
