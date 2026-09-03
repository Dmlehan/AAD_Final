import React from 'react';
import { Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Sun size={20} />
          </div>
          <span>Sun Baby <span style={{ color: 'var(--primary-600)' }}>English</span></span>
        </Link>
        <nav className="header-nav">
          <Link to="/" className="nav-link active">Dashboard</Link>
          <span className="badge badge-success">
            <span className="status-dot"></span> System Live
          </span>
        </nav>
      </div>
    </header>
  );
}
