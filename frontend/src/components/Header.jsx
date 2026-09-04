import React from 'react';
import { Sun, Lock, LogOut, Users, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
          <Link to="/" className="nav-link">Home</Link>
          <a href="/#programs" className="nav-link">Programs</a>
          <a href="/#payment-flow" className="nav-link">Fee Payment Flow</a>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
              {user?.role === 'ADMIN' && (
                <Link to="/admin/users" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Users size={15} /> Staff
                </Link>
              )}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                padding: '0.3rem 0.65rem',
                background: '#f1f5f9',
                borderRadius: 'var(--radius-md)',
                color: '#334155'
              }}>
                <User size={14} color="#64748b" />
                <span style={{ fontWeight: 600 }}>{user?.fullName || user?.username}</span>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.4rem',
                  background: user?.role === 'ADMIN' ? '#fef3c7' : '#e0f2fe',
                  color: user?.role === 'ADMIN' ? '#92400e' : '#0369a1',
                  borderRadius: '999px',
                  fontWeight: 700
                }}>
                  {user?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                title="Sign Out"
              >
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
              <Lock size={14} /> Staff Portal
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
