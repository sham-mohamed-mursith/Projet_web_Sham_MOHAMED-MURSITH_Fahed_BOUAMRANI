export default class EquipementsPage {
    constructor(provider) {
        this.provider = provider;
    }

    async render() {
        const equipements = await this.provider.getEquipements();
        return `
            <h2>Liste des Équipements</h2>
            <ul>
                ${equipements.map(eq => `
                    <li>
                        <a href="#" class="equipement-link" data-id="${eq.id}">${eq.name}</a>
                    </li>
                `).join('')}
            </ul>
            <div id="equipement-details"></div>
        `;
    }

    async afterRender() {
        document.querySelectorAll('.equipement-link').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const id = e.target.dataset.id;
                const equipements = await this.provider.getEquipements();
                const equipement = equipements.find(eq => eq.id == id);
                document.getElementById("equipement-details").innerHTML = `
                    <h3>${equipement.name}</h3>
                    <p>Type : ${equipement.type}</p>
                    ${equipement.damage ? `<p>Dégâts : ${equipement.damage}</p>` : ""}
                    ${equipement.defense ? `<p>Défense : ${equipement.defense}</p>` : ""}
                `;
            });
        });
    }
}
