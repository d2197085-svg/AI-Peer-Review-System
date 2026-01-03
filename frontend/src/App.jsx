import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login'; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, AreaChart, Area } from 'recharts';
import { ShieldAlert, BookOpen, Activity, Download, ChevronRight, FileText, CheckCircle, AlertTriangle, Lightbulb, Star, User, Plus, Eye, BarChart3, ShieldCheck, LogOut, Globe, Clock } from 'lucide-react';

// --- ADDED THIS FOR RENDER ---
const API_URL = "https://ai-reviewer-backend-8q85.onrender.com";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('manuscripts');
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleLoginSuccess = (userName) => { setUser(userName); setIsAuthenticated(true); };
  const handleLogout = () => { setIsAuthenticated(false); setUser(null); setData(null); };

  const loadData = async () => {
    try {
      const res = await axios.get(`${API_URL}/history`);
      setHistory(res.data);
    } catch (e) { console.log("Backend offline"); }
  };

  useEffect(() => { if (isAuthenticated) loadData(); }, [activeTab, isAuthenticated]);

  const startReview = async () => {
    if (!file) return alert("Select PDF first!");
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await axios.post(`${API_URL}/analyze`, form);
      setData(res.data);
      loadData();
    } catch (e) { alert("Backend Error! Ensure Render service is live."); }
    finally { setLoading(false); }
  };

  if (!isAuthenticated) return <Login onLoginSuccess={handleLoginSuccess} />;

  return (
    <div style={styles.dashboard}>
      <aside style={styles.sidebar}>
        <div style={styles.logoSection}><ShieldAlert size={28} color="#818cf8" /> <span style={styles.logoText}>ReviewerAI</span></div>
        <nav style={styles.nav}>
          <div onClick={() => setActiveTab('manuscripts')} style={activeTab === 'manuscripts' ? styles.navItemActive : styles.navItem}><BookOpen size={18}/> Manuscripts</div>
          <div onClick={() => setActiveTab('audit')} style={activeTab === 'audit' ? styles.navItemActive : styles.navItem}><Activity size={18}/> Audit History</div>
          <div onClick={() => setActiveTab('metrics')} style={activeTab === 'metrics' ? styles.navItemActive : styles.navItem}><BarChart3 size={18}/> Global Metrics</div>
          <div onClick={() => setActiveTab('ethics')} style={activeTab === 'ethics' ? styles.navItemActive : styles.navItem}><ShieldCheck size={18}/> Ethics Board</div>
        </nav>
        <div onClick={handleLogout} style={styles.logoutBtn}><LogOut size={18}/> Logout</div>
      </aside>

      <main style={styles.main}>
        <header style={styles.topNav}>
          <div><h1 style={styles.tabTitle}>{activeTab.toUpperCase()}</h1><p style={{color: '#64748b', fontSize: '12px'}}>Lead Editor: {user}</p></div>
          {activeTab === 'manuscripts' && (
            <div style={styles.uploadGroup}>
              <label style={styles.fileLabel}><Plus size={16} /> {file ? file.name.substring(0, 12) : "Select PDF"}
                <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{display: 'none'}} accept=".pdf" />
              </label>
              <button onClick={startReview} disabled={loading} style={styles.btnPrimary}>{loading ? "Analyzing..." : "Run Audit"}</button>
            </div>
          )}
        </header>

        {activeTab === 'manuscripts' && (
          data ? (
            <div style={styles.grid}>
              <div style={{gridColumn: 'span 7'}}>
                <div style={styles.card}><div style={styles.cardHeader}><Eye size={18}/> Visual Audit</div><iframe src={data.pdf_url} style={styles.pdfViewer} /></div>
                <div style={styles.dualStats}>
                   <div style={{...styles.card, borderTop: '4px solid #6366f1'}}><h4>Methodology</h4><p style={styles.smallText}>{data.method_text}</p></div>
                   <div style={{...styles.card, borderTop: '4px solid #10b981'}}><h4>Statistics</h4><p style={styles.smallText}>{data.stat_text}</p></div>
                </div>
              </div>
              <div style={{gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '20px'}}>
                <div style={styles.scoreCard}><h1>{data.score}</h1><p>QUALITY SCORE</p></div>
                <div style={styles.card}><h4>AI Report</h4><div style={styles.aiContent}>{data.ai_report}</div></div>
              </div>
            </div>
          ) : <div style={styles.heroState}><Globe size={48}/><h2 style={{color: '#000'}}>Ready for Manuscript Audit</h2></div>
        )}

        {activeTab === 'audit' && (
           <div style={styles.card}>
              <table style={styles.table}>
                <thead><tr style={styles.th}><th>DATE</th><th>TITLE</th><th>SCORE</th><th>ACTION</th></tr></thead>
                <tbody>{history.map((h, i) => (
                  <tr key={i} style={styles.tr}><td><Clock size={12}/> {h.date}</td><td><b>{h.title}</b></td><td>{h.score}</td><td><a href={h.pdf_url} target="_blank" style={styles.link}>View</a></td></tr>
                ))}</tbody>
              </table>
           </div>
        )}

        {activeTab === 'metrics' && (
          <div style={styles.grid}>
            <div style={{...styles.card, gridColumn: 'span 12'}}>
              <h3>Institutional Quality Trend</h3>
              <div style={{height: '300px', marginTop: '20px'}}>
                <ResponsiveContainer><AreaChart data={history}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="date"/><YAxis domain={[0, 10]}/><Tooltip/><Area type="monotone" dataKey="score" stroke="#6366f1" fill="#e0e7ff" /></AreaChart></ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ethics' && (
          <div style={{...styles.card, gridColumn: 'span 8', borderLeft: '10px solid #6366f1'}}>
            <h3 style={{color:'#000'}}>Scientific Integrity Guidelines</h3>
            <p style={{lineHeight: '2', marginTop: '15px', color: '#475569'}}>• Bias Detection • Data Integrity • AI Disclosure Policy</p>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  dashboard: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif' },
  sidebar: { width: '280px', backgroundColor: '#0f172a', padding: '30px', display: 'flex', flexDirection: 'column' },
  logoSection: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '50px' },
  logoText: { color: 'white', fontSize: '24px', fontWeight: '900' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
  navItem: { padding: '14px 18px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '12px' },
  navItemActive: { padding: '14px 18px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '12px' },
  logoutBtn: { padding: '14px 18px', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  topNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  tabTitle: { fontSize: '26px', fontWeight: '900', margin: 0, color: '#000' },
  uploadGroup: { display: 'flex', background: 'white', padding: '6px', borderRadius: '16px', border: '1px solid #e2e8f0' },
  fileLabel: { padding: '10px 20px', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' },
  btnPrimary: { background: '#6366f1', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '30px' },
  card: { background: 'white', padding: '30px', borderRadius: '30px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
  pdfViewer: { width: '100%', height: '550px', border: 'none', borderRadius: '20px', background: '#f1f5f9' },
  dualStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' },
  smallTitle: { fontSize: '14px', fontWeight: 'bold', color: '#000', marginBottom: '5px' },
  smallText: { fontSize: '12px', color: '#64748b' },
  scoreCard: { background: '#0f172a', color: 'white', padding: '40px', borderRadius: '30px', textAlign: 'center' },
  aiContent: { fontSize: '13px', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: '#475569', maxHeight: '400px', overflowY: 'auto' },
  heroState: { height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: '11px', color: '#94a3b8', borderBottom: '1px solid #f1f5f9', padding: '15px' },
  tr: { borderBottom: '1px solid #f1f5f9', fontSize: '14px', height: '70px', color: '#000' },
  link: { color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }
};

export default App;