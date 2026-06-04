import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserService from '../services/UserService';

const userService = new UserService();

export default function Register() {
  const history = useHistory();
  const [form, setForm] = useState({
    username: '', fname: '', email: '',
    phone: '', password: '', confirm: '',
  });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.'); return;
    }
    if (form.phone.length < 8) {
      setError('Numéro de téléphone invalide.'); return;
    }

    setLoading(true);
    const res = await userService.addUser({
      username: form.username,
      fname:    form.fname,
      email:    form.email,
      phone:    form.phone,
      password: form.password,
      isadmin:  0,
    });
    setLoading(false);

    if (res.success) {
      setSuccess('Compte créé avec succès ! Redirection...');
      setTimeout(() => history.push('/login'), 2000);
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>✈</div>
          <h2 style={styles.title}>Créer un compte</h2>
          <p style={styles.subtitle}>Rejoignez BookMyFlight</p>
        </div>

        {/* Alerts */}
        {error   && <div style={styles.alertErr}>{error}</div>}
        {success && <div style={styles.alertOk}>{success}</div>}

        <form onSubmit={submit} style={styles.form}>
          <div style={styles.row}>
            <Field label="Nom d'utilisateur" name="username" value={form.username} onChange={handle} icon="👤" />
            <Field label="Nom complet"        name="fname"    value={form.fname}    onChange={handle} icon="📋" />
          </div>
          <div style={styles.row}>
            <Field label="Email"    type="email" name="email" value={form.email} onChange={handle} icon="📧" />
            <Field label="Téléphone" name="phone" value={form.phone} onChange={handle} icon="📱" />
          </div>
          <div style={styles.row}>
            <Field label="Mot de passe"        type="password" name="password" value={form.password} onChange={handle} icon="🔒" />
            <Field label="Confirmer le mot de passe" type="password" name="confirm" value={form.confirm} onChange={handle} icon="🔑" />
          </div>

          <button type="submit" style={loading ? styles.btnLoading : styles.btn} disabled={loading}>
            {loading ? 'Création en cours...' : "S'inscrire"}
          </button>
        </form>

        <p style={styles.footer}>
          Déjà un compte ?{' '}
          <span style={styles.link} onClick={() => history.push('/login')}>
            Se connecter
          </span>
        </p>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, icon, type = 'text' }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputWrap}>
        <span style={styles.icon}>{icon}</span>
        <input
          required
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          style={styles.input}
          placeholder={label}
        />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: 'rgba(255,255,255,0.97)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%', maxWidth: '680px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
  },
  header: { textAlign: 'center', marginBottom: '28px' },
  logo: { fontSize: '48px', marginBottom: '8px' },
  title: { margin: 0, fontSize: '26px', fontWeight: '700', color: '#2d3748' },
  subtitle: { margin: '4px 0 0', color: '#718096', fontSize: '14px' },
  alertErr: {
    background: '#fff5f5', border: '1px solid #fc8181',
    color: '#c53030', borderRadius: '10px',
    padding: '12px 16px', marginBottom: '20px', fontSize: '14px',
  },
  alertOk: {
    background: '#f0fff4', border: '1px solid #68d391',
    color: '#276749', borderRadius: '10px',
    padding: '12px 16px', marginBottom: '20px', fontSize: '14px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  row: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  field: { flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#4a5568' },
  inputWrap: {
    display: 'flex', alignItems: 'center',
    border: '2px solid #e2e8f0', borderRadius: '10px',
    background: '#f7fafc', overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  icon: { padding: '0 10px', fontSize: '16px' },
  input: {
    flex: 1, padding: '11px 12px 11px 0',
    border: 'none', background: 'transparent',
    fontSize: '14px', color: '#2d3748', outline: 'none',
  },
  btn: {
    marginTop: '8px', padding: '14px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff', border: 'none', borderRadius: '12px',
    fontSize: '16px', fontWeight: '700', cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
  },
  btnLoading: {
    marginTop: '8px', padding: '14px',
    background: '#a0aec0', color: '#fff',
    border: 'none', borderRadius: '12px',
    fontSize: '16px', fontWeight: '700', cursor: 'not-allowed',
  },
  footer: { textAlign: 'center', marginTop: '20px', color: '#718096', fontSize: '14px' },
  link: { color: '#667eea', fontWeight: '600', cursor: 'pointer' },
};