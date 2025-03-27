export default class Provider {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.cache = new Map();
  }

  async fetchWithCache(endpoint) {
    const cacheKey = `${endpoint}_${new Date().toISOString().slice(0, 16)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    const res = await fetch(`${this.apiUrl}${endpoint}`);
    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
    const data = await res.json();
    this.cache.set(cacheKey, data);
    return data;
  }

  async getPersonnages() {
    const data = await this.fetchWithCache('/personnages');
    return Array.isArray(data) ? data : data.personnages || [];
  }

  async getEquipements() {
    const data = await this.fetchWithCache('/equipements');
    return Array.isArray(data) ? data : data.equipements || [];
  }

  async getPersonnageById(id) {
    const personnages = await this.getPersonnages();
    return personnages.find(p => p.id === id);
  }

  async getEquipementById(id) {
    const equipements = await this.getEquipements();
    return equipements.find(e => e.id === id);
  }

  async updatePersonnageRating(id, newRating) {
    const response = await fetch(`${this.apiUrl}/personnages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: newRating })
    });
    if (!response.ok) throw new Error("Échec de la mise à jour de la note");
    return response.json();
  }
}
