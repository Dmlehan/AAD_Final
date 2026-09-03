import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <div style={{
        width: '56px',
        height: '56px',
        margin: '0 auto 1.25rem',
        background: '#fff1f2',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e11d48',
      }}>
        <HelpCircle size={32} />
      </div>
      <h2 style={{ color: '#0f172a' }}>Page Not Found</h2>
      <p style={{ margin: '0.5rem auto 1.75rem', maxWidth: '400px', color: '#64748b' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={16} /> Return to Dashboard
      </Link>
    </div>
  );
}
