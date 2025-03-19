import Provider from './provider.js';
import PersonnagesPage from './views/pages/personnages.js';
import EquipementsPage from './views/pages/equipements.js';

const provider = new Provider('http://localhost:3000');
const content = document.querySelector('#content');

// Définition des routes
const routes = {
    '/personnages': () => new PersonnagesPage(provider),
    '/equipements': () => new EquipementsPage(provider),
};

// Fonction pour gérer le routage
const router = async () => {
    let hash = location.hash.slice(1) || '/personnages'; // Par défaut : personnages
    const page = routes[hash] ? routes[hash]() : new PersonnagesPage(provider);
    
    content.innerHTML = await page.render();
    await page.afterRender();
};

// Écouter les changements de hash dans l'URL
window.addEventListener('hashchange', router);
window.addEventListener('load', router);
