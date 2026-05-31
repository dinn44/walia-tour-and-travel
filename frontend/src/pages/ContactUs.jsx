import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={styles.contact} className="animate-fade-in">
      <div style={styles.header}>
        <span className="badge badge-primary">Support Desk</span>
        <h1 style={styles.title}>Acquisition Enquiries</h1>
        <p style={styles.subtitle}>Direct connection to our customer concierges and global dispatch centers.</p>
      </div>

      <div style={styles.grid}>
        {/* Contact Form */}
        <div className="glass-panel" style={styles.formCard}>
          <h3 style={{ marginBottom: '20px' }}>Direct Message</h3>
          {submitted && (
            <div className="badge badge-success" style={styles.successBadge}>
              <Check size={14} />
              Inquiry dispatch recorded. We will connect within 12 hours.
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.inquiryForm}>
            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Your Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Jane Doe"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="jane@example.com"
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                name="subject"
                value={form.subject}
                onChange={handleInputChange}
                placeholder="Product sizing, shipping quote..."
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea 
                name="message"
                value={form.message}
                onChange={handleInputChange}
                placeholder="Type your message details here..."
                rows="6"
                className="form-control"
                style={{ resize: 'none' }}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
              <Send size={16} />
              Dispatch Inquiry
            </button>
          </form>
        </div>

        {/* Brand coordinates */}
        <div style={styles.coordsCol}>
          <div className="glass-panel" style={styles.coordCard}>
            <h3 style={{ marginBottom: '24px' }}>DIN Head Coordinates</h3>
            
            <div style={styles.coordLines}>
              <div style={styles.coordLine}>
                <MapPin size={18} style={styles.icon} />
                <div>
                  <p style={styles.key}>Atelier HQ Location</p>
                  <p style={styles.val}>100 Obsidian Plaza, Suite 400<br/>New York, NY 10001</p>
                </div>
              </div>
              <div style={styles.coordLine}>
                <Mail size={18} style={styles.icon} />
                <div>
                  <p style={styles.key}>General Support Desk</p>
                  <p style={styles.val}>concierge@din.com</p>
                </div>
              </div>
              <div style={styles.coordLine}>
                <Phone size={18} style={styles.icon} />
                <div>
                  <p style={styles.key}>Hotline Phone Channel</p>
                  <p style={styles.val}>+1 (800) 555-0199 (Mon-Fri)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  contact: {
    maxWidth: '1280px',
    margin: '40px auto',
    padding: '0 24px',
    paddingBottom: '80px'
  },
  header: {
    marginBottom: '48px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '24px',
    textAlign: 'center'
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '2.5rem',
    fontWeight: 800,
    marginTop: '6px',
    letterSpacing: '-0.02em'
  },
  subtitle: {
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    maxWidth: '600px',
    margin: '8px auto 0 auto'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '40px',
    alignItems: 'start',
    '@media (max-width: 992px)': {
      gridTemplateColumns: '1fr',
    }
  },
  formCard: {
    padding: '40px',
    background: 'var(--bg-tertiary)',
    boxShadow: 'var(--shadow-sm)'
  },
  successBadge: {
    width: '100%',
    padding: '12px 20px',
    justifyContent: 'center',
    marginBottom: '20px',
    fontSize: '0.9rem'
  },
  inquiryForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  formRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  submitBtn: {
    alignSelf: 'flex-start',
    height: '46px',
    marginTop: '12px'
  },
  coordsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  coordCard: {
    padding: '40px',
    background: 'var(--bg-tertiary)',
    boxShadow: 'var(--shadow-sm)'
  },
  coordLines: {
    display: 'flex',
    flexDirection: 'column',
    gap: '28px'
  },
  coordLine: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start'
  },
  icon: {
    color: 'var(--accent)',
    marginTop: '2px'
  },
  key: {
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    marginBottom: '4px'
  },
  val: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: 'var(--text-primary)',
    fontWeight: 500
  }
};

export default ContactUs;
