import React from 'react';
import { Sun, ShieldCheck, GraduationCap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Sun size={22} />
          </div>
          <span>Sun Baby <span style={{ color: 'var(--primary-400)' }}>English</span></span>
        </Link>
        <nav className="header-nav">
          <Link to="/" className="nav-link active">Home & System Health</Link>
          <span className="badge badge-success">
            <span className="status-dot"></span> Phase 1 Base Active
          </span>
        </nav>
      </div>
    </header>
  );
}
