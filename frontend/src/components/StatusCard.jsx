import React from 'react';

export default function StatusCard({ icon: Icon, title, value, subtitle, statusColor = 'var(--primary-600)', iconBg = '#fef3c7' }) {
  return (
    <div className="card">
      <div className="card-header">
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        {Icon && (
          <div style={{ color: statusColor, padding: '0.5rem', background: iconBg, borderRadius: 'var(--radius-md)' }}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div style={{ fontSize: '1.45rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
        {value}
      </div>
      {subtitle && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>{subtitle}</p>}
    </div>
  );
}
