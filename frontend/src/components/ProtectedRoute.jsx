import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
        Verifying authorization...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div style={{ maxWidth: '550px', margin: '4rem auto', textAlign: 'center' }} className="card">
        <div style={{
          width: '56px',
          height: '56px',
          margin: '0 auto 1.25rem',
          background: '#fff1f2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#e11d48'
        }}>
          <ShieldAlert size={32} />
        </div>
        <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '0.5rem' }}>Access Restricted</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          This section requires administrative privileges (<code>{requiredRole}</code>). Your current account role is <strong>{user?.role}</strong>.
        </p>
        <a href="/" className="btn btn-secondary">
          Return to Dashboard
        </a>
      </div>
    );
  }

  return children;
}
