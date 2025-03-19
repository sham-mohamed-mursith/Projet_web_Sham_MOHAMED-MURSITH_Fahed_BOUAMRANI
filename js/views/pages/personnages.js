export default class PersonnagesPage {
    constructor(provider) {
        this.provider = provider;
    }

    async render() {
        const personnages = await this.provider.getPersonnages();
        return `
            <h2>Liste des Personnages</h2>
            <ul>
                ${personnages.map(perso => `
                    <li>
                        <a href="#" class="personnage-link" data-id="${perso.id}">${perso.name}</a>
                    </li>
                `).join('')}
            </ul>
            <div id="personnage-details"></div>
        `;
    }

    async afterRender() {
        document.querySelectorAll('.personnage-link').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const id = e.target.dataset.id;
                const perso = await this.provider.getPersonnageById(id);
                document.getElementById("personnage-details").innerHTML = `
                    <h3>${perso.name}</h3>
                    <p>Classe : ${perso.class}</p>
                    <p>Niveau : ${perso.level}</p>
                    <p>Note : ${perso.rating} ⭐</p>
                `;
            });
        });
    }
}
