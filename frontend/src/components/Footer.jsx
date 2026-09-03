import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>&copy; {new Date().getFullYear()} Sun Baby English Student Management System. Built with Spring Boot & React.</p>
      <p style={{ fontSize: '0.8rem', marginTop: '0.4rem', color: 'var(--text-subtle)' }}>
        Notice: Manual class payment tracking enabled. Online payment gateways (Stripe/PayPal) strictly disabled.
      </p>
    </footer>
  );
}
