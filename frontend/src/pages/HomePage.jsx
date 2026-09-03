import React, { useState, useEffect } from 'react';
import {
  Server, Database, ShieldAlert, CheckCircle2, AlertCircle, RefreshCw,
  Users, UserCheck, BookOpen, Calendar, DollarSign, Award, FileText
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
    { title: 'Users & Roles', icon: Users, desc: 'Admin, Teacher, and Staff accounts with BCrypt readiness', count: 'users' },
    { title: 'Students & Guardians', icon: UserCheck, desc: 'Student profiles linked with multiple guardians and primary contact', count: 'students, guardians' },
    { title: 'Classes & Academic Years', icon: BookOpen, desc: 'Academic calendar, English levels (Starters to Flyers), and scheduled classes', count: 'class_groups, academic_years' },
    { title: 'Attendance Management', icon: Calendar, desc: 'Session-level attendance with Present, Absent, Late, Excused tracking', count: 'attendance_records' },
    { title: 'Offline Payments & WhatsApp Slips', icon: DollarSign, desc: 'Manual fee tracking with WhatsApp receipt image/PDF metadata and approval', count: 'payments, payment_receipts' },
    { title: 'Exams & Performance Marks', icon: Award, desc: 'Class exam scheduling, mark sheets, percentages, and grade calculations', count: 'exams, exam_marks' },
  ];

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span className="badge badge-success">Phase 2: Core Domain Model Active</span>
        </div>
        <h1>Sun Baby English Student Management System</h1>
        <p style={{ fontSize: '1.1rem', marginTop: '0.5rem', maxWidth: '800px' }}>
          Comprehensive management platform for Sun Baby English classes, student profiles, attendance, examinations, and offline payment tracking.
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
          title="Database Schema"
          value="14 Core Tables"
          subtitle="Flyway V1 baseline & V2 core domain models active"
          statusColor="var(--accent-blue)"
        />
        <StatusCard
          icon={ShieldAlert}
          title="Payment Architecture"
          value="WhatsApp Receipts"
          subtitle="Manual offline recording; Online gateways disabled"
          statusColor="var(--primary-400)"
        />
      </div>

      {/* Domain Entities Grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ marginBottom: '1.25rem' }}>Core Domain Architecture (Phase 2)</h3>
        <div className="grid grid-cols-3">
          {coreDomainModels.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ padding: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--primary-400)' }}>
                    <Icon size={20} />
                  </div>
                  <span style={{ fontWeight: 600, color: '#fff', fontSize: '1.05rem' }}>{item.title}</span>
                </div>
                <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>{item.desc}</p>
                <code style={{ fontSize: '0.75rem', color: 'var(--primary-300)', background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                  {item.count}
                </code>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase Roadmap Overview */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Development Roadmap Status</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <span style={{ fontWeight: 600, color: '#fff' }}>Phase 1: Project Audit, Architecture & Base Setup</span>
              <p style={{ fontSize: '0.85rem' }}>Spring Boot 3, React, Flyway, Error envelopes, CORS, Maven wrapper</p>
            </div>
            <span className="badge badge-success">Completed</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <span style={{ fontWeight: 600, color: 'var(--primary-400)' }}>Phase 2: Database Foundation & Core Domain Model</span>
              <p style={{ fontSize: '0.85rem' }}>14 Core tables, JPA entities, foreign keys, offline WhatsApp receipts, repository test suite</p>
            </div>
            <span className="badge badge-success">Completed</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <span style={{ fontWeight: 600, color: '#fff' }}>Phase 3: JWT Authentication, Spring Security & User Management</span>
              <p style={{ fontSize: '0.85rem' }}>Spring Security filter chain, JWT tokens, BCrypt hashing, login/register, role guards</p>
            </div>
            <span className="badge badge-info">Next Up</span>
          </div>
        </div>
      </div>
    </div>
  );
}
