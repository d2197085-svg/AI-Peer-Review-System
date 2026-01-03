import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login'; 
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, 
  AreaChart, Area 
} from 'recharts';
import { 
  ShieldAlert, BookOpen, Activity, Download, CheckCircle, 
  AlertTriangle, User, Plus, Eye, BarChart3, ShieldCheck, LogOut, ChevronRight, FileText, Clock, Globe
} from 'lucide-react';

function App() {
  // --- AUTH & NAVIGATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('manuscripts');

  // --- DATA STATE ---
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleLoginSuccess = (userName) => {
    setUser(userName);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setData(null);
  };

  // FETCH HISTORY & METRICS
  const loadHistory = async () => {
    try {
      const res = await axios.get("http://localhost:8000/history");
      setHistory(res.data);
    } catch (e) { console.log("Backend offline - using memory"); }
  };

  useEffect(() => {
    if (isAuthenticated) loadHistory();
  }, [activeTab, isAuthenticated]);

  const startReview = async () => {
    if (!file) return alert("Select PDF first!");
    setLoading(true);
    setData(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await axios.post("http://localhost:8000/analyze", form);
      setData(res.data);
      loadHistory();
    } catch (e) { alert("Backend Error!"); }
    finally { setLoading(false); }
  };

  // --- 1. AUTH GATE ---
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // --- 2. FULL INDUSTRY DASHBOARD ---
  return (
    <div style={styles.dashboard}>
      
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logoSection}>
          <ShieldAlert size={28} color="#818cf8" />
          <span style={styles.logoText}>ReviewerAI</span>
        </div>
        
        <nav style={styles.nav}>
          <div onClick={() => setActiveTab('manuscripts')} style={activeTab === 'manuscripts' ? styles.navItemActive : styles.navItem}>
            <BookOpen size={18}/> Manuscripts
          </div>
          <div onClick={() => setActiveTab('audit')} style={activeTab === 'audit' ? styles.navItemActive : styles.navItem}>
            <Activity size={18}/> Audit History
          </div>
          <div onClick={() => setActiveTab('metrics')} style={activeTab === 'metrics' ? styles.navItemActive : styles.navItem}>
            <BarChart3 size={18}/> Global Metrics
          </div>
          <div onClick={() => setActiveTab('ethics')} style={activeTab === 'ethics' ? styles.navItemActive : styles.navItem}>
            <ShieldCheck size={18}/> Ethics Board
          </div>
        </nav>

        <div onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={18}/> Logout System
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={styles.main}>
        
        {/* TOP NAVBAR */}
        <header style={styles.topNav}>
          <div>
            <h1 style={styles.tabTitle}>{activeTab.toUpperCase()}</h1>
            <p style={{color: '#64748b', fontSize: '12px'}}>Logged in as: {user} (Lead Admin)</p>
          </div>
          
          {activeTab === 'manuscripts' && (
            <div style={styles.uploadGroup}>
              <label style={styles.fileLabel}>
                <Plus size={16} /> {file ? file.name.substring(0, 12) : "Select Manuscript"}
                <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{display: 'none'}} accept=".pdf" />
              </label>
              <button onClick={startReview} disabled={loading} style={styles.btnPrimary}>
                {loading ? "Analyzing..." : "Run New Audit"}
              </button>
            </div>
          )}
        </header>

        {/* LOADING SPINNER */}
        {loading && (
          <div style={styles.heroState}>
            <div className="pulse-loader" style={styles.loader}></div>
            <h2 style={{marginTop: '20px', color: '#000'}}>AI Processing...</h2>
            <p>Scanning methodology and calculating validity score.</p>
          </div>
        )}

        {/* --- PAGE 1: MANUSCRIPTS --- */}
        {activeTab === 'manuscripts' && !loading && (
          !data ? (
            <div style={styles.heroState}>
              <div style={styles.heroCircle}><Globe size={48} color="#6366f1" /></div>
              <h2 style={{color: '#000'}}>Ready for Scientific Audit</h2>
              <p style={{color: '#64748b'}}>Upload a PDF to view visual error highlights and Gemini AI report.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {/* LEFT: PDF & DUAL BOXES */}
              <div style={{gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '20px'}}>
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}><Eye size={18}/> Visual Error Audit</h3>
                    <span style={styles.badgeRed}>{data.mistake_count} Flags</span>
                  </div>
                  <iframe src={data.pdf_url} style={styles.pdfViewer} title="PDF" />
                </div>
                <div style={styles.dualStats}>
                  <div style={{...styles.card, borderTop: '4px solid #6366f1'}}>
                    <h4 style={styles.smallTitle}><CheckCircle size={14} color="#6366f1" /> Methodology</h4>
                    <p style={styles.smallText}>{data.method_text}</p>
                  </div>
                  <div style={{...styles.card, borderTop: '4px solid #10b981'}}>
                    <h4 style={styles.smallTitle}><AlertTriangle size={14} color="#10b981" /> Statistics</h4>
                    <p style={styles.smallText}>{data.stat_text}</p>
                  </div>
                </div>
              </div>
              {/* RIGHT: SCORE & AI REPORT */}
              <div style={{gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '25px'}}>
                <div style={styles.scoreCard}>
                  <p style={{fontSize: '11px', opacity: 0.7}}>QUALITY SCORE</p>
                  <h1 style={styles.scoreNumber}>{data.score}</h1>
                  <a href={data.pdf_url} target="_blank" rel="noreferrer" style={styles.downloadBtn}>Download PDF</a>
                </div>
                <div style={styles.card}>
                  <h3 style={{...styles.cardTitle, marginBottom: '15px'}}>AI Intelligence Summary</h3>
                  <div style={styles.aiContent}>{data.ai_report}</div>
                </div>
              </div>
            </div>
          )
        )}

        {/* --- PAGE 2: AUDIT HISTORY --- */}
        {activeTab === 'audit' && (
          <div style={styles.card}>
            <table style={styles.table}>
              <thead><tr style={styles.th}><th>DATE</th><th>MANUSCRIPT TITLE</th><th>SCORE</th><th>ACTION</th></tr></thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} style={styles.tr}>
                    <td><Clock size={12}/> {h.date}</td>
                    <td><b>{h.title}</b></td>
                    <td><span style={styles.badgeBlue}>{h.score}/10</span></td>
                    <td><a href={h.pdf_url} target="_blank" style={styles.link}>View Report</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- PAGE 3: GLOBAL METRICS --- */}
        {activeTab === 'metrics' && (
          <div style={styles.grid}>
            <div style={{...styles.card, gridColumn: 'span 12'}}>
              <h3 style={{color: '#000'}}>Institutional Quality Trend</h3>
              <div style={{height: '300px', marginTop: '20px'}}>
                <ResponsiveContainer>
                  <AreaChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" fill="#e0e7ff" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* --- PAGE 4: ETHICS BOARD --- */}
        {activeTab === 'ethics' && (
          <div style={styles.grid}>
            <div style={{gridColumn: 'span 8', ...styles.card, borderLeft: '10px solid #6366f1'}}>
               <h3>Scientific Integrity Guidelines (COPE)</h3>
               <p style={{lineHeight: '2', marginTop: '15px', color: '#475569'}}>
                  • <b>Bias Detection:</b> AI automatically flags subjective claims.<br/>
                  • <b>Data Integrity:</b> Statistical consistency is checked against p-value standards.<br/>
                  • <b>Disclosure:</b> Authors must disclose AI usage in drafting.
               </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// --- ALL INDUSTRY STYLES RESTORED ---
const styles = {
  dashboard: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif' },
  sidebar: { width: '280px', backgroundColor: '#0f172a', padding: '30px', display: 'flex', flexDirection: 'column' },
  logoSection: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '50px' },
  logoText: { color: 'white', fontSize: '24px', fontWeight: '900' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
  navItem: { padding: '14px 18px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '12px' },
  navItemActive: { padding: '14px 18px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '12px' },
  logoutBtn: { padding: '14px 18px', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  topNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  tabTitle: { fontSize: '26px', fontWeight: '900', margin: 0, color: '#000' },
  uploadGroup: { display: 'flex', background: 'white', padding: '6px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
  fileLabel: { padding: '10px 20px', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' },
  btnPrimary: { background: '#6366f1', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '30px' },
  card: { background: 'white', padding: '30px', borderRadius: '30px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
  cardTitle: { fontSize: '16px', fontWeight: 'bold', color: '#000', margin: 0 },
  badgeRed: { background: '#fee2e2', color: '#ef4444', fontSize: '11px', padding: '4px 10px', borderRadius: '6px' },
  badgeBlue: { background: '#e0e7ff', color: '#6366f1', fontSize: '11px', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold' },
  pdfViewer: { width: '100%', height: '550px', border: 'none', borderRadius: '20px', background: '#f1f5f9' },
  dualStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  smallTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', margin: '0 0 10px 0', color: '#000' },
  smallText: { fontSize: '12px', color: '#64748b', margin: 0 },
  scoreCard: { background: '#0f172a', color: 'white', padding: '40px', borderRadius: '30px', textAlign: 'center' },
  scoreNumber: { fontSize: '64px', fontWeight: 'bold', margin: '10px 0' },
  downloadBtn: { display: 'block', background: '#6366f1', color: 'white', padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', marginTop: '20px' },
  aiContent: { fontSize: '13px', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: '#475569', maxHeight: '400px', overflowY: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: '11px', color: '#94a3b8', borderBottom: '2px solid #f1f5f9', padding: '15px' },
  tr: { borderBottom: '1px solid #f1f5f9', fontSize: '14px', height: '70px', color: '#000' },
  link: { color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' },
  heroState: { height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
  heroCircle: { width: '100px', height: '100px', background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' },
  loader: { width: '40px', height: '40px', border: '4px solid #e0e7ff', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }
};

export default App;