export default class Provider {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    async getPersonnages() {
        const response = await fetch(`${this.apiUrl}/personnages`);
        if (!response.ok) throw new Error('Erreur lors du chargement des personnages');
        return response.json();
    }

    async getEquipements() {
        const response = await fetch(`${this.apiUrl}/equipements`);
        if (!response.ok) throw new Error('Erreur lors du chargement des équipements');
        return response.json();
    }

    // Exemple si tu veux récupérer un personnage par son id
    async getPersonnageById(id) {
        const response = await fetch(`${this.apiUrl}/personnages/${id}`);
        if (!response.ok) throw new Error('Personnage introuvable');
        return response.json();
    }
}
