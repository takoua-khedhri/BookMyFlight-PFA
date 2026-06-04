import axios from "axios";

// Utilisez l'URL complète du backend
const BASE_URL = "http://localhost:8980";

export default class UserService {

    async validateUser(username, password) {
        try {
            console.log('🔐 Tentative connexion:', username);
            
            // URL correcte (sans slash au début)
            const response = await axios.get(`${BASE_URL}/auth/${username}/${password}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 10000
            });
            
            console.log('✅ Réponse:', response.data);
            
            if (response.status === 200 && response.data) {
                // Stocker l'utilisateur dans localStorage
                localStorage.setItem('user', JSON.stringify(response.data));
                return { success: true, data: response.data };
            }
            
            return { success: false, message: "Identifiants incorrects" };
            
        } catch (error) {
            console.error('❌ Erreur:', error);
            
            if (error.response?.status === 401 || error.response?.status === 404) {
                return { success: false, message: "Nom d'utilisateur ou mot de passe incorrect" };
            }
            
            return { success: false, message: "Erreur de connexion au serveur" };
        }
    }
}