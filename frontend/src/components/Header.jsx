import React from 'react';
import { Sun, Lock } from 'lucide-react';
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
          <a href="#programs" className="nav-link">Programs</a>
          <a href="#payment-flow" className="nav-link">Fee Payment Flow</a>
          <a href="#portal" className="btn btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
            <Lock size={14} /> Staff Portal
          </a>
        </nav>
      </div>
    </header>
  );
}
