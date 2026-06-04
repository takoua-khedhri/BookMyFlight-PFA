/**
 * FlightServiceRest.js
 * Service pour la gestion des vols avec l'API backend Spring Boot
 */

const API_BASE_URL = 'http://localhost:8980';

export default class FlightServiceRest {
    constructor() {
        this.apiUrl = `${API_BASE_URL}/flight`;
        this.timeout = 10000;
    }

    /**
     * Gestionnaire d'erreurs
     */
    handleError(error) {
        console.error('FlightService Error:', error);
        
        if (error.name === 'AbortError') {
            return { 
                success: false, 
                error: 'La requête a expiré. Veuillez réessayer.',
                code: 'TIMEOUT'
            };
        }
        
        if (error.message === 'Failed to fetch') {
            return { 
                success: false, 
                error: 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur le port 8980.',
                code: 'CONNECTION_REFUSED'
            };
        }
        
        return { 
            success: false, 
            error: error.message || 'Une erreur inattendue est survenue',
            code: 'UNKNOWN'
        };
    }

    /**
     * Récupère toutes les villes uniques (sources et destinations)
     */
    async getCities() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            
            const response = await fetch(`${this.apiUrl}/cities`, {
                signal: controller.signal,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log('🏙️ Villes récupérées:', data);
            
            if (data.success && data.cities) {
                return data.cities;
            }
            
            return ['Paris', 'Londres', 'New York', 'Dubai', 'Tokyo'];
            
        } catch (error) {
            console.error('Erreur récupération villes:', error);
            return ['Paris', 'Londres', 'New York', 'Dubai', 'Tokyo'];
        }
    }

    /**
     * Récupère tous les vols
     */
    async getFlights() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            
            const response = await fetch(`${this.apiUrl}/fetchall`, {
                signal: controller.signal,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.flights) {
                console.log(`✅ ${data.count} vols récupérés`);
                return data.flights;
            }
            
            return [];
            
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    /**
     * Recherche des vols par critères
     */
    async getFlightsForUser(source, destination, date) {
        if (!source || !destination || !date) {
            console.warn('Paramètres de recherche manquants');
            return [];
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            
            const url = `${this.apiUrl}/fetch?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&date=${date}`;
            console.log(`🔍 Recherche: ${source} -> ${destination} le ${date}`);
            
            const response = await fetch(url, {
                signal: controller.signal,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.flights) {
                console.log(`✅ ${data.count} vol(s) trouvé(s)`);
                return data.flights;
            }
            
            return [];
            
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    /**
     * Ajoute un nouveau vol
     */
    async saveFlight(flight) {
        try {
            const response = await fetch(`${this.apiUrl}/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(flight)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Vol ajouté:', data);
            return data;
            
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Met à jour un vol
     */
    async updateFlight(flight) {
        try {
            const response = await fetch(`${this.apiUrl}/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(flight)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Vol mis à jour:', data);
            return data;
            
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Supprime un vol
     */
    async deleteFlight(flightNumber) {
        try {
            const response = await fetch(`${this.apiUrl}/remove/${flightNumber}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json"
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Vol supprimé:', data);
            return data;
            
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }
}