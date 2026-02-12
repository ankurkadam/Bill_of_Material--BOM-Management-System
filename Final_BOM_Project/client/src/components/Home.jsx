import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home({ username }) {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  return (
    <div className={`page ${dark ? "dark" : ""}`}>

    
      <header className="header">
        <div className="brand">
          <AnimatedLogo />
          <span className="brand-text">BOM Management</span>
        </div>

        <div className="nav-actions">
          <button className="theme-btn" onClick={() => setDark(!dark)}>
            {dark ? "🌙" : "☀️"}
          </button>
          <button className="link-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="primary-btn" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </header>

     
      <section className="hero">
        <h1>Bill of Material Management System</h1>
        <p>
          A modern platform to design, control and version complex product
          structures with precision and clarity.
        </p>

        <div className="hero-actions">
          <button className="primary-btn" onClick={() => navigate("/login")}>
            Get Started
          </button>
          <button className="secondary-btn" onClick={() => navigate("/register")}>
            Create Account
          </button>
        </div>
      </section>

      <section className="features">
        <Feature title="Product Structuring" desc="Define products with multi-level hierarchy." />
        <Feature title="Component Control" desc="Centralized component management." />
        <Feature title="BOM Tree" desc="Clear parent–child BOM relationships." />
        <Feature title="Version Tracking" desc="Maintain revision history & rollback." />
        <Feature title="Secure Access" desc="JWT based authentication." />
        <Feature title="High Performance" desc="Optimized workflows & fast UI." />
      </section>

      <section className="info">
        <h2>Engineered for Accuracy</h2>
        <p>
          Designed for manufacturing and engineering teams who need reliable,
          scalable and traceable Bill of Material management.
        </p>
      </section>

     
      <footer className="footer">
        <p>© BOM Management System</p>
        <p>{username ? `Logged in as ${username}` : "Not logged in"}</p>
      </footer>

      <style>{css}</style>
    </div>
  );
}

function AnimatedLogo() {
  return (
    <svg className="logo" width="44" height="44" viewBox="0 0 100 100">
      <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
      <circle cx="50" cy="50" r="10" />
      <circle cx="50" cy="15" r="4" />
      <circle cx="85" cy="50" r="4" />
      <circle cx="50" cy="85" r="4" />
      <circle cx="15" cy="50" r="4" />
    </svg>
  );
}


function Feature({ title, desc }) {
  return (
    <div className="feature-card">
      <div className="accent"></div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}


const css = `
* {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
  background: radial-gradient(circle at top, #eef2ff, #f8fafc);
  color: #1f2937;
  transition: background 0.3s, color 0.3s;
}

/* 🌙 DARK MODE */
.page.dark {
  background: radial-gradient(circle at top, #020617, #020617);
  color: #e5e7eb;
}

/* HEADER */
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 48px;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(14px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
}

.page.dark .header {
  background: rgba(2,6,23,0.85);
}

/* BRAND */
.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-text {
  font-size: 18px;
  font-weight: 600;
}

/* LOGO */
.logo polygon {
  fill: none;
  stroke: #3b82f6;
  stroke-width: 3;
  animation: spin 12s linear infinite;
}

.page.dark .logo polygon {
  stroke: #60a5fa;
}

.logo circle {
  fill: #2563eb;
  animation: pulse 2s ease-in-out infinite;
}

.page.dark .logo circle {
  fill: #93c5fd;
}

/* HERO */
.hero {
  text-align: center;
  padding: 110px 20px 70px;
  animation: fadeUp 1s ease;
}

.hero p {
  color: #4b5563;
}

.page.dark .hero p {
  color: #cbd5f5;
}

/* FEATURES */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
  padding: 70px 70px;
}

.feature-card {
  background: rgba(255,255,255,0.9);
  border-radius: 18px;
  padding: 30px;
  min-height: 180px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.06);
  animation: fadeUp 0.8s ease forwards;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.page.dark .feature-card {
  background: #020617;
}

.feature-card p {
  color: #4b5563;
}

.page.dark .feature-card p {
  color: #cbd5f5;
}

/* INFO */
.info {
  text-align: center;
  padding: 80px 20px;
}

.info p {
  color: #4b5563;
}

.page.dark .info p {
  color: #cbd5f5;
}

/* FOOTER */
.footer {
  text-align: center;
  padding: 28px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
}

.page.dark .footer {
  background: #020617;
  border-color: #1e293b;
}

/* BUTTONS */
.primary-btn {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  border: none;
  padding: 13px 28px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 12px;
}

.secondary-btn {
  background: #eef2ff;
  border: none;
  padding: 13px 28px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.page.dark .secondary-btn {
  background: #1e293b;
  color: #e5e7eb;
}

.link-btn {
  background: transparent;
  border: none;
  margin-right: 16px;
  font-weight: 600;
  cursor: pointer;
  color: inherit;
}

.theme-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  margin-right: 16px;
  cursor: pointer;
}

@keyframes spin {
  to { transform: rotate(360deg); transform-origin: center; }
}

@keyframes pulse {
  0%,100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export default Home;
