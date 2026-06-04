// index.js - Version complète et optimisée
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

// Import des styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './assets/css/App.css';  // Ajout de votre CSS personnalisé

// Import des composants
import App from './App';
import reportWebVitals from './reportWebVitals';

// Configuration du render avec error boundary
const root = document.getElementById('root');

// Fonction pour gérer les erreurs globales
const handleGlobalError = (error, errorInfo) => {
  console.error('Global Error:', error, errorInfo);
  // Vous pouvez ajouter ici un service de logging comme Sentry
};

// Composant Error Boundary simple
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    handleGlobalError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div>
            <h1>😓 Oups ! Une erreur est survenue</h1>
            <p>Nous nous excusons pour le désagrément. Veuillez rafraîchir la page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-light mt-3"
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Render principal avec Error Boundary
ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
  root
);

// Configuration des performances
const reportPerformance = (metric) => {
  // Afficher les métriques en développement
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metric.name}: ${metric.value}`);
  }
  
  // En production, vous pouvez envoyer à Google Analytics ou autre service
  if (process.env.NODE_ENV === 'production') {
    // Exemple: sendToAnalytics(metric)
  }
};

// Mesurer les performances
reportWebVitals(reportPerformance);

// Service Worker pour PWA (optionnel)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      (registration) => {
        console.log('ServiceWorker registration successful');
      },
      (err) => {
        console.log('ServiceWorker registration failed: ', err);
      }
    );
  });
}

// Gestion de la connexion internet
window.addEventListener('online', () => {
  console.log('🟢 Connexion internet rétablie');
  // Vous pouvez déclencher une reconnexion des WebSockets ou autres
});

window.addEventListener('offline', () => {
  console.log('🔴 Connexion internet perdue');
  // Afficher une notification à l'utilisateur
  const notification = document.createElement('div');
  notification.className = 'offline-notification';
  notification.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; right: 0; background: #f56565; color: white; text-align: center; padding: 10px; z-index: 10000;">
      ⚠️ Vous êtes hors ligne. Vérifiez votre connexion internet.
    </div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
});

// Empêcher le clic droit sur les images (optionnel)
document.addEventListener('contextmenu', (e) => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

// Ajouter une classe au body pour la détection du thème
const theme = localStorage.getItem('theme') || 'light';
document.body.className = `theme-${theme}`;