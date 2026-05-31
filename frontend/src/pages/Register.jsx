import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock } from 'lucide-react';

const Register = () => {
  const { register, user, error: authError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setFormError('Please complete all form conditions.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    setFormError(null);

    const res = await register(name, email, password);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setFormError(res.message || 'Registration failed.');
    }
  };

  return (
    <div style={styles.registerPage} className="animate-fade-in">
      <div className="glass-panel" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>D I N</div>
          <h2>Join the Circle</h2>
          <p style={styles.subtitle}>Create an account to track shipments, record wishlist items, and save profiles.</p>
        </div>

        {(formError || authError) && (
          <div className="badge badge-danger" style={styles.errorBox}>
            {formError || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label>Full Name</label>
            <div style={styles.inputWrapper}>
              <input 
                type="text" 
                placeholder="Jane Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                style={styles.input}
                required
              />
              <User size={16} style={styles.inputIcon} />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div style={styles.inputWrapper}>
              <input 
                type="email" 
                placeholder="jane@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                style={styles.input}
                required
              />
              <Mail size={16} style={styles.inputIcon} />
            </div>
          </div>

          <div className="form-group">
            <label>Create Password</label>
            <div style={styles.inputWrapper}>
              <input 
                type="password" 
                placeholder="Minimum 6 characters" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                style={styles.input}
                required
              />
              <Lock size={16} style={styles.inputIcon} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary"
            style={styles.submitBtn}
          >
            {loading ? 'Registering Account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footerLink}>
          Already cataloged in DIN? <Link to="/login" style={styles.highlight}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  registerPage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '85vh',
    padding: '40px 24px'
  },
  card: {
    maxWidth: '440px',
    width: '100%',
    padding: '40px',
    background: 'var(--bg-tertiary)',
    boxShadow: 'var(--shadow-lg)',
    textAlign: 'center'
  },
  header: {
    marginBottom: '30px'
  },
  logoBadge: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.4rem',
    fontWeight: 800,
    letterSpacing: '0.15em',
    color: 'var(--accent)',
    marginBottom: '16px'
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    marginTop: '6px'
  },
  errorBox: {
    width: '100%',
    padding: '10px',
    justifyContent: 'center',
    marginBottom: '20px',
    fontSize: '0.85rem'
  },
  form: {
    textAlign: 'left'
  },
  inputWrapper: {
    position: 'relative'
  },
  input: {
    paddingLeft: '40px'
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)'
  },
  submitBtn: {
    width: '100%',
    height: '46px',
    marginTop: '10px'
  },
  footerLink: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '24px'
  },
  highlight: {
    color: 'var(--accent)',
    fontWeight: 700
  }
};

export default Register;
