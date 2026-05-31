import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

const Login = () => {
  const { login, user, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirect ? `/${redirect}` : '/');
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setFormError('Please input credentials details.');
      return;
    }

    setLoading(true);
    setFormError(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate(redirect ? `/${redirect}` : '/');
    } else {
      setFormError(res.message || 'Invalid login details.');
    }
  };

  return (
    <div style={styles.loginPage} className="animate-fade-in">
      <div className="glass-panel" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>D I N</div>
          <h2>Authentication Panel</h2>
          <p style={styles.subtitle}>Enter credentials to access checkout, wishlists, and order timelines.</p>
        </div>

        {(formError || authError) && (
          <div className="badge badge-danger" style={styles.errorBox}>
            {formError || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label>Registered Email</label>
            <div style={styles.inputWrapper}>
              <input 
                type="email" 
                placeholder="customer@din.com" 
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label>Password</label>
              <span style={styles.forgot}>Forgot?</span>
            </div>
            <div style={styles.inputWrapper}>
              <input 
                type="password" 
                placeholder="customer123" 
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
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footerLink}>
          New to the DIN Platform? <Link to="/register" style={styles.highlight}>Create Account</Link>
        </p>

        {/* Quick Testing Credentials Box */}
        <div style={styles.demoCredentialsBox}>
          <h4 style={styles.demoHeading}>Local Testing Profiles</h4>
          <p style={styles.demoLine}><strong>Admin:</strong> admin@din.com / admin123</p>
          <p style={styles.demoLine}><strong>Customer:</strong> customer@din.com / customer123</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  loginPage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
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
  forgot: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    cursor: 'pointer'
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
  },
  demoCredentialsBox: {
    marginTop: '30px',
    padding: '16px',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-sm)',
    border: '1px dashed var(--border-color)',
    textAlign: 'left',
    transition: 'background-color 0.4s ease'
  },
  demoHeading: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px'
  },
  demoLine: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginBottom: '4px',
    ':last-child': {
      marginBottom: 0
    }
  }
};

export default Login;
