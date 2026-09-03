import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <p style={{ color: '#64748b' }}>
        &copy; {new Date().getFullYear()} Sun Baby English Student Management System. Built with Spring Boot & React.
      </p>
      <p style={{ fontSize: '0.8rem', marginTop: '0.35rem', color: '#94a3b8' }}>
        Payment Policy: Manual offline class fee recording with WhatsApp receipt verification. Online gateways disabled.
      </p>
    </footer>
  );
}
