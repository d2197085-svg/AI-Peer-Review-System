import React, { useState } from 'react';
import axios from 'axios';
import { ShieldAlert, Lock, Mail, ShieldCheck } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Connects to the "Universal Login" logic in your Python backend
      const res = await axios.post("http://localhost:8000/login", { 
        email: email, 
        password: password 
      });

      if (res.data.status === "success") {
        // Pass the dynamic username (e.g., "Vinaya") to the main App
        onLoginSuccess(res.data.user); 
      }
    } catch (err) {
      if (err.response) {
        // Shows the specific error from Python (e.g., "Password too short")
        alert(err.response.data.detail);
      } else {
        alert("CRITICAL ERROR: Backend server (main.py) is not running!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <ShieldAlert size={32} color="white" />
          </div>
          <h1 style={styles.title}>Reviewer<span style={{color: '#818cf8'}}>AI</span></h1>
          <p style={styles.subtitle}>Institutional Peer Review Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Institutional Email</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.fieldIcon} />
              <input 
                type="email" 
                placeholder="name@university.edu" 
                style={styles.input}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Security Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.fieldIcon} />
              <input 
                type="password" 
                placeholder="••••••••" 
                style={styles.input}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" style={styles.loginBtn} disabled={loading}>
            {loading ? "Verifying Credentials..." : "Secure Sign In"}
          </button>
        </form>

        {/* Footer info for External Examiner */}
        <div style={styles.footer}>
          <div style={styles.securityTag}>
            <ShieldCheck size={14} /> End-to-End Encrypted Session
          </div>
          <p style={styles.legalText}>
            This system is for authorized research personnel only. 
            Unauthorized access is strictly monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- ELITE INDUSTRY STYLES ---
const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at top right, #1e293b, #0f172a)', // Deep Navy Gradient
    fontFamily: "'Inter', sans-serif"
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.98)',
    padding: '50px 40px',
    borderRadius: '32px',
    width: '420px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    textAlign: 'center'
  },
  iconWrapper: {
    background: '#6366f1',
    width: '64px',
    height: '64px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)'
  },
  title: {
    fontSize: '28px',
    fontWeight: '900',
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-1px'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '14px',
    marginTop: '5px',
    fontWeight: '500'
  },
  form: {
    marginTop: '40px',
    textAlign: 'left'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: '8px',
    marginLeft: '4px'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  fieldIcon: {
    position: 'absolute',
    left: '15px',
    color: '#94a3b8'
  },
  input: {
    width: '100%',
    padding: '14px 14px 14px 45px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    background: '#f8fafc',
    fontSize: '14px',
    outline: 'none',
    color: '#0f172a',
    transition: '0.2s'
  },
  loginBtn: {
    width: '100%',
    padding: '16px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)',
    transition: '0.3s'
  },
  footer: {
    marginTop: '30px'
  },
  securityTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: '#10b981', // Green for success/secure
    fontWeight: '700',
    background: '#ecfdf5',
    padding: '5px 12px',
    borderRadius: '20px'
  },
  legalText: {
    fontSize: '10px',
    color: '#94a3b8',
    marginTop: '15px',
    lineHeight: '1.5'
  }
};

export default Login;