export default class Provider {
    constructor(apiUrl) {
      this.apiUrl = apiUrl;
      this.cache = new Map(); // Ajouter un cache pour améliorer les performances
    }
  
    /**
     * Récupère les données avec gestion de cache
     * @param {string} endpoint - Le point d'entrée API
     * @returns {Promise<any>} Les données récupérées
     */
    async fetchWithCache(endpoint) {
      // Vérifier si les données sont en cache et si elles ont moins de 5 minutes
      const cacheKey = `${endpoint}_${new Date().toISOString().slice(0, 16)}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
  
      try {
        const response = await fetch(`${this.apiUrl}${endpoint}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Mettre en cache les données
        this.cache.set(cacheKey, data);
        
        return data;
      } catch (error) {
        console.error(`Erreur lors de la récupération depuis ${endpoint}:`, error);
        throw error;
      }
    }
  
    /**
     * Récupère tous les personnages
     * @returns {Promise<Array>} Liste des personnages
     */
    async getPersonnages() {
      const data = await this.fetchWithCache('/personnages');
      return Array.isArray(data) ? data : data.personnages || [];
    }
  
    /**
     * Récupère tous les équipements
     * @returns {Promise<Array>} Liste des équipements
     */
    async getEquipements() {
      const data = await this.fetchWithCache('/equipements');
      return Array.isArray(data) ? data : data.equipements || [];
    }
  
    /**
     * Récupère un personnage par son ID
     * @param {number} id - ID du personnage
     * @returns {Promise<Object>} Détails du personnage
     */
    async getPersonnageById(id) {
      const personnages = await this.getPersonnages();
      return personnages.find(p => p.id === id);
    }
  
    /**
     * Récupère un équipement par son ID
     * @param {number} id - ID de l'équipement
     * @returns {Promise<Object>} Détails de l'équipement
     */
    async getEquipementById(id) {
      const equipements = await this.getEquipements();
      return equipements.find(e => e.id === id);
    }
  }