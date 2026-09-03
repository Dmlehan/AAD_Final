import React, { useState, useEffect } from 'react';
import {
  Server, Database, ShieldAlert, CheckCircle2, AlertCircle, RefreshCw,
  Users, UserCheck, BookOpen, Calendar, DollarSign, Award
} from 'lucide-react';
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

  const coreDomainModels = [
    { title: 'Users & Roles', icon: Users, desc: 'Teacher and administrator management with secure authentication', tag: 'users' },
    { title: 'Students & Guardians', icon: UserCheck, desc: 'Student enrollment records linked to multiple family guardians', tag: 'students, guardians' },
    { title: 'Classes & Levels', icon: BookOpen, desc: 'Class schedules, academic calendar, and English levels (Starters to Flyers)', tag: 'class_groups, academic_years' },
    { title: 'Daily Attendance', icon: Calendar, desc: 'Session-based attendance marking (Present, Absent, Late, Excused)', tag: 'attendance_records' },
    { title: 'Offline Payments & WhatsApp Slips', icon: DollarSign, desc: 'Class fee tracking with WhatsApp payment receipt attachment and verification', tag: 'payments, payment_receipts' },
    { title: 'Examinations & Marks', icon: Award, desc: 'Exams, marks entry, percentage calculations, and progress grading', tag: 'exams, exam_marks' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-warning">Sun Baby English Portal</span>
        </div>
        <h1 style={{ color: '#0f172a' }}>Student Management System</h1>
        <p style={{ fontSize: '1.05rem', color: '#475569', marginTop: '0.25rem', maxWidth: '750px' }}>
          Clean, unified platform for managing student profiles, classes, daily attendance, exams, and offline fee payments with WhatsApp receipts.
        </p>
      </div>

      {/* Primary Status Cards */}
      <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
        <StatusCard
          icon={Server}
          title="Backend API"
          value={loading ? 'Checking...' : error ? 'Offline' : (health?.status || 'UP')}
          subtitle={error ? error : 'Spring Boot 3.3.4 (Operational)'}
          statusColor={error ? '#e11d48' : '#059669'}
          iconBg={error ? '#ffe4e6' : '#dcfce7'}
        />
        <StatusCard
          icon={Database}
          title="Database"
          value="14 Tables Active"
          subtitle="MySQL 8.0 & Flyway V1 / V2 Migrations"
          statusColor="#2563eb"
          iconBg="#dbeafe"
        />
        <StatusCard
          icon={ShieldAlert}
          title="Payment Method"
          value="WhatsApp Receipt"
          subtitle="Manual offline tracking; Online gateways disabled"
          statusColor="#d97706"
          iconBg="#fef3c7"
        />
      </div>

      {/* Backend Health Check Verification Panel */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header" style={{ marginBottom: '1rem' }}>
          <div>
            <h3>API Connection Status</h3>
            <p style={{ fontSize: '0.875rem' }}>Live probe to <code>/api/v1/health</code></p>
          </div>
          <button
            onClick={fetchHealth}
            disabled={loading}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            Refresh
          </button>
        </div>

        {loading && (
          <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Checking backend status...
          </div>
        )}

        {!loading && error && (
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#be123c'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.9rem' }}>
              <strong>Backend Disconnected:</strong> {error}
            </div>
          </div>
        )}

        {!loading && health && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#15803d', fontWeight: 600 }}>
              <CheckCircle2 size={18} />
              <span>Backend Connected and Healthy</span>
            </div>
            <pre style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              padding: '0.875rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              color: '#334155',
              overflowX: 'auto',
            }}>
              {JSON.stringify(health, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Core Domain Modules (Phase 2) */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#0f172a' }}>System Modules & Data Foundation</h3>
        <div className="grid grid-cols-3">
          {coreDomainModels.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ padding: '0.45rem', background: '#fef3c7', borderRadius: 'var(--radius-md)', color: '#d97706' }}>
                    <Icon size={18} />
                  </div>
                  <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '1rem' }}>{item.title}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>{item.desc}</p>
                <code style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                  {item.tag}
                </code>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roadmap Status Panel */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: '#0f172a' }}>Development Roadmap</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)' }}>
            <div>
              <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.925rem' }}>Phase 1: Project Audit, Architecture & Base Setup</span>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Spring Boot 3, React 18, Flyway, Error envelopes, CORS, Maven wrapper</p>
            </div>
            <span className="badge badge-success">Completed</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)' }}>
            <div>
              <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.925rem' }}>Phase 2: Database Foundation & Core Domain Model</span>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>14 Core tables, JPA entities, foreign keys, offline WhatsApp receipts, repository tests</p>
            </div>
            <span className="badge badge-success">Completed</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)' }}>
            <div>
              <span style={{ fontWeight: 600, color: '#b45309', fontSize: '0.925rem' }}>Phase 3: JWT Authentication, Spring Security & User Management</span>
              <p style={{ fontSize: '0.8rem', color: '#92400e' }}>Spring Security, BCrypt hashing, JWT tokens, login & role permissions</p>
            </div>
            <span className="badge badge-warning">Next Up</span>
          </div>
        </div>
      </div>
    </div>
  );
}
