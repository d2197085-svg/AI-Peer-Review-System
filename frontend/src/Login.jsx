import React, { useState } from 'react';
import axios from 'axios';
import { ShieldAlert, Lock, Mail, ShieldCheck } from 'lucide-react';

// --- ADDED THIS FOR RENDER ---
const API_URL = "https://ai-reviewer-backend-8q85.onrender.com";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      if (res.data.status === "success") {
        onLoginSuccess(res.data.user); 
      }
    } catch (err) {
      if (err.response) { alert(err.response.data.detail); }
      else { alert("Backend server is not running!"); }
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <div style={styles.header}>
          <div style={styles.iconWrapper}><ShieldAlert size={32} color="white" /></div>
          <h1 style={styles.title}>Reviewer<span style={{color: '#818cf8'}}>AI</span></h1>
          <p style={styles.subtitle}>Institutional Peer Review Portal</p>
        </div>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Institutional Email</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.fieldIcon} />
              <input type="email" placeholder="name@university.edu" style={styles.input}
                onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Security Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.fieldIcon} />
              <input type="password" placeholder="••••••••" style={styles.input}
                onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          <button type="submit" style={styles.loginBtn} disabled={loading}>
            {loading ? "Verifying Credentials..." : "Secure Sign In"}
          </button>
        </form>
        <div style={styles.footer}>
          <div style={styles.securityTag}><ShieldCheck size={14} /> End-to-End Encrypted</div>
          <p style={styles.legalText}>Authorized research personnel only. Unauthorized access is monitored.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at top right, #1e293b, #0f172a)', fontFamily: "'Inter', sans-serif" },
  glassCard: { background: 'rgba(255, 255, 255, 0.98)', padding: '50px 40px', borderRadius: '32px', width: '420px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', textAlign: 'center' },
  iconWrapper: { background: '#6366f1', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
  title: { fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-1px' },
  subtitle: { color: '#64748b', fontSize: '14px', marginTop: '5px' },
  form: { marginTop: '40px', textAlign: 'left' },
  inputGroup: { marginBottom: '20px' },
  label: { fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  fieldIcon: { position: 'absolute', left: '15px', color: '#94a3b8' },
  input: { width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', outline: 'none', color: '#000' },
  loginBtn: { width: '100%', padding: '16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' },
  footer: { marginTop: '30px' },
  securityTag: { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#10b981', fontWeight: '700', background: '#ecfdf5', padding: '5px 12px', borderRadius: '20px' },
  legalText: { fontSize: '10px', color: '#94a3b8', marginTop: '15px' }
};
export default Login;