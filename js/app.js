import Provider from './provider.js';

const provider = new Provider('http://localhost:3000');
const main = document.querySelector('main');

async function afficherPersonnages() {
    try {
        const personnages = await provider.getPersonnages();

        personnages.forEach(perso => {
            const card = document.createElement('div');
            card.classList.add('personnage-card');
            card.innerHTML = `
                <h2>${perso.name}</h2>
                <p>Classe : ${perso.class}</p>
                <p>Niveau : ${perso.level}</p>
                <p>Note : ${perso.rating} ⭐</p>
            `;
            main.appendChild(card);
        });

    } catch (error) {
        console.error('Erreur de chargement des personnages :', error);
        main.textContent = 'Erreur lors du chargement des personnages.';
    }
}

afficherPersonnages();