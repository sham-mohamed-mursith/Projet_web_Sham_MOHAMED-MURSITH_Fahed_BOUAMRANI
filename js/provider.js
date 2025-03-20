export default class Provider {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    async getPersonnages() {
        const response = await fetch(`${this.apiUrl}/personnages`);
        if (!response.ok) throw new Error("Erreur lors du chargement des personnages");
        return response.json();
    }
}
