import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import UserService from '../services/UserService';
import planeBG from "../assets/images/planebg1.jpg";

const Login = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    const userService = new UserService();
    const result = await userService.validateUser(username, password);

    if (result.success) {
      localStorage.setItem('user', JSON.stringify(result.data));
      if (result.data.isadmin === 1) {
        history.push('/admin');
      } else {
        history.push('/');
      }
    } else {
      setError(result.message || 'Nom d\'utilisateur ou mot de passe incorrect');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>✈</div>
          <h2 style={styles.title}>Connexion</h2>
          <p style={styles.subtitle}>Bienvenue sur BookMyFlight</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nom d'utilisateur</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>👤</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                placeholder="Entrez votre nom d'utilisateur"
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Entrez votre mot de passe"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button type="submit" style={loading ? styles.buttonDisabled : styles.button} disabled={loading}>
            {loading ? (
              <span>
                <span style={styles.spinner}></span>
                Connexion en cours...
              </span>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p>
            Pas encore de compte ?{' '}
            <Link to="/register" style={styles.link}>
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%), url(${planeBG})`,
    backgroundSize: 'cover',
    backgroundBlend: 'overlay',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    animation: 'fadeInUp 0.6s ease-out',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  logo: {
    fontSize: '48px',
    marginBottom: '10px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#718096',
  },
  errorAlert: {
    background: '#fed7d7',
    color: '#c53030',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '16px',
    color: '#a0aec0',
  },
  input: {
    width: '100%',
    padding: '12px 40px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  passwordToggle: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '5px',
  },
  button: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    padding: '14px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  buttonDisabled: {
    background: '#a0aec0',
    color: 'white',
    padding: '14px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: 'white',
    animation: 'spin 0.6s linear infinite',
    marginRight: '8px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default Login;