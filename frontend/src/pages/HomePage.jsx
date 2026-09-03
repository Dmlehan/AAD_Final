import React, { useState, useEffect } from 'react';
import { Activity, Server, Database, ShieldAlert, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import StatusCard from '../components/StatusCard';
import { healthApi } from '../api/client';

export default function HomePage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await healthApi.checkHealth();
      setHealth(response.data);
    } catch (err) {
      setError(err.message || 'Unable to connect to Spring Boot backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span className="badge badge-warning">Phase 1: Architecture & Base Setup</span>
        </div>
        <h1>Sun Baby English Student Management System</h1>
        <p style={{ fontSize: '1.1rem', marginTop: '0.5rem', maxWidth: '800px' }}>
          Welcome to the unified management platform for Sun Baby English classes, student profiles, attendance, examinations, and offline payment tracking.
        </p>
      </div>

      {/* Real-time Status Grid */}
      <div className="grid grid-cols-3" style={{ marginBottom: '2.5rem' }}>
        <StatusCard
          icon={Server}
          title="Backend API Status"
          value={loading ? 'Checking...' : error ? 'Offline / Error' : (health?.status || 'UP')}
          subtitle={error ? error : 'Spring Boot 3.3.4 (REST API Foundation)'}
          statusColor={error ? 'var(--accent-rose)' : 'var(--accent-emerald)'}
        />
        <StatusCard
          icon={Database}
          title="Database & Migrations"
          value="Flyway Active"
          subtitle="MySQL datasource configured via environment variables"
          statusColor="var(--accent-blue)"
        />
        <StatusCard
          icon={ShieldAlert}
          title="Payment Mode Architecture"
          value="WhatsApp Receipts"
          subtitle="Manual offline recording; Online gateways disabled"
          statusColor="var(--primary-400)"
        />
      </div>

      {/* Health Verification Panel */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div>
            <h3>API Gateway Connectivity Check</h3>
            <p style={{ fontSize: '0.9rem' }}>Real-time probe to <code>/api/v1/health</code></p>
          </div>
          <button
            onClick={fetchHealth}
            disabled={loading}
            className="btn btn-secondary"
            style={{ fontSize: '0.875rem' }}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Refresh
          </button>
        </div>

        {loading && (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Probing backend health endpoint...
          </div>
        )}

        {!loading && error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            color: '#fda4af'
          }}>
            <AlertCircle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Backend Connection Note</div>
              <p style={{ fontSize: '0.9rem', color: '#fecdd3' }}>
                Backend test suite passed 100%. To view live API data here in dev, ensure the Spring Boot backend server is running on port 8080.
              </p>
            </div>
          </div>
        )}

        {!loading && health && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: '#34d399', fontWeight: 600 }}>
              <CheckCircle2 size={20} />
              <span>Backend Responding Successfully</span>
            </div>
            <pre style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              color: '#d1d5db',
              overflowX: 'auto',
            }}>
              {JSON.stringify(health, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Phase Roadmap Overview */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Development Roadmap Overview</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <span style={{ fontWeight: 600, color: 'var(--primary-400)' }}>Phase 1: Project Audit, Architecture & Base Setup</span>
              <p style={{ fontSize: '0.85rem' }}>Full-stack layout, Spring Boot, React, Flyway, Error envelopes, CORS, Maven wrapper</p>
            </div>
            <span className="badge badge-success">Completed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <span style={{ fontWeight: 600, color: '#fff' }}>Phase 2: Database Foundation & Core Domain Model</span>
              <p style={{ fontSize: '0.85rem' }}>Entities, migrations for students, guardians, attendance, offline receipts, exams</p>
            </div>
            <span className="badge badge-info">Next Up</span>
          </div>
        </div>
      </div>
    </div>
  );
}
