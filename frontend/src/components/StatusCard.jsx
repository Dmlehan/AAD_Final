import React from 'react';

export default function StatusCard({ icon: Icon, title, value, subtitle, statusColor = 'var(--primary-400)' }) {
  return (
    <div className="card">
      <div className="card-header">
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{title}</span>
        {Icon && (
          <div style={{ color: statusColor, padding: '0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)' }}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: '#fff', marginBottom: '0.25rem' }}>
        {value}
      </div>
      {subtitle && <p style={{ fontSize: '0.85rem' }}>{subtitle}</p>}
    </div>
  );
}
