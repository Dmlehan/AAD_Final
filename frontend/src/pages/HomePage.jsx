import React, { useState, useEffect } from 'react';
import {
  BookOpen, Users, Calendar, Award, MessageCircle,
  CheckCircle2, ArrowRight, ShieldCheck, HeartHandshake, Sparkles, Clock
} from 'lucide-react';
import { healthApi } from '../api/client';

export default function HomePage() {
  const [healthStatus, setHealthStatus] = useState('Checking...');

  useEffect(() => {
    healthApi.checkHealth()
      .then((res) => setHealthStatus(res.data?.status || 'Online'))
      .catch(() => setHealthStatus('Offline'));
  }, []);

  const programs = [
    {
      level: 'Starters',
      age: 'Ages 5 – 7',
      focus: 'Foundational Phonics & Spoken English',
      description: 'Engaging, playful learning that introduces letters, sounds, simple words, and confident greetings in English.',
      badge: 'Beginner'
    },
    {
      level: 'Movers',
      age: 'Ages 8 – 10',
      focus: 'Reading, Grammar & Everyday Dialogue',
      description: 'Children expand vocabulary, construct full sentences, practice listening, and speak with increasing fluency.',
      badge: 'Intermediate'
    },
    {
      level: 'Flyers',
      age: 'Ages 11 – 13',
      focus: 'Advanced Conversation & Exam Preparation',
      description: 'Comprehensive English mastery preparing students for higher school grades and international exam certifications.',
      badge: 'Advanced'
    }
  ];

  const features = [
    {
      icon: Users,
      title: 'Small Interactive Groups',
      desc: 'Carefully sized classes so every child receives personalized guidance, encouragement, and active speaking time.'
    },
    {
      icon: Calendar,
      title: 'Reliable Daily Attendance',
      desc: 'Consistent schedules with automated session tracking to ensure regular academic participation.'
    },
    {
      icon: Award,
      title: 'Transparent Progress & Exams',
      desc: 'Regular quizzes, evaluations, and comprehensive report cards keeping parents informed every step of the way.'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Payment Verification',
      desc: 'Simple, secure offline fee submission. Parents share transfer slips directly via WhatsApp for verified recording.'
    }
  ];

  return (
    <div>
      {/* 1. Hero Section */}
      <section style={{ textAlign: 'center', padding: '3.5rem 1rem 3rem', maxWidth: '820px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#fef3c7',
          color: '#b45309',
          padding: '0.35rem 0.9rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.25rem'
        }}>
          <Sparkles size={16} /> Sun Baby English Academy
        </div>

        <h1 style={{ fontSize: '2.6rem', color: '#0f172a', lineHeight: 1.2, marginBottom: '1rem', fontWeight: 800 }}>
          Where Young Learners Become Confident English Speakers
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.6, marginBottom: '2rem' }}>
          A caring, interactive, and structured learning environment dedicated to developing English fluency, reading, and writing for school children.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#portal" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
            Staff & Teacher Portal <ArrowRight size={16} />
          </a>
          <a href="#programs" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
            View English Levels
          </a>
        </div>
      </section>

      {/* 2. Key Pillars & Values */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="grid grid-cols-2">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '1.5rem' }}>
                <div style={{
                  padding: '0.75rem',
                  background: '#fef3c7',
                  color: '#d97706',
                  borderRadius: 'var(--radius-md)',
                  flexShrink: 0
                }}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.35rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Academic Programs & English Levels */}
      <section id="programs" style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Curriculum Structure
          </span>
          <h2 style={{ fontSize: '1.85rem', color: '#0f172a', marginTop: '0.25rem' }}>
            Tailored English Learning Levels
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
            Structured around proven age-appropriate milestones from early speech to confident exam proficiency.
          </p>
        </div>

        <div className="grid grid-cols-3">
          {programs.map((prog, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>{prog.badge}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{prog.age}</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: '#0f172a', marginBottom: '0.5rem' }}>{prog.level}</h3>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-600)', marginBottom: '0.75rem' }}>
                  {prog.focus}
                </div>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.55 }}>
                  {prog.description}
                </p>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={14} color="#10b981" /> Regular class assessments included
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Payment Flow Explainer (WhatsApp Receipt Flow) */}
      <section id="payment-flow" style={{ marginBottom: '3.5rem' }}>
        <div className="card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '2rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2rem' }}>
            <span style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Simple & Transparent
            </span>
            <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginTop: '0.25rem' }}>
              How Fee Payments Work
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.925rem', marginTop: '0.4rem' }}>
              We avoid third-party card processors and online payment gateways. Parents pay directly and share receipts via WhatsApp for hassle-free verification.
            </p>
          </div>

          <div className="grid grid-cols-3">
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '32px', height: '32px', background: '#dbeafe', color: '#1d4ed8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                1
              </div>
              <h4 style={{ color: '#0f172a', marginBottom: '0.35rem' }}>Monthly Fee Notice</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569' }}>
                Teacher communicates monthly class fees and bank details at the beginning of each academic period.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '32px', height: '32px', background: '#fef3c7', color: '#b45309', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                2
              </div>
              <h4 style={{ color: '#0f172a', marginBottom: '0.35rem' }}>WhatsApp Receipt</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569' }}>
                Parent makes a bank transfer or cash deposit and sends a photo/screenshot of the receipt slip to the academy's WhatsApp.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '32px', height: '32px', background: '#dcfce7', color: '#15803d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                3
              </div>
              <h4 style={{ color: '#0f172a', marginBottom: '0.35rem' }}>Verified & Recorded</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569' }}>
                Teacher uploads and attaches the receipt file to the student record and marks payment status as Verified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Staff & Teacher Portal Callout */}
      <section id="portal" style={{ marginBottom: '2rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <ShieldCheck size={18} /> Internal Administration
            </div>
            <h2 style={{ fontSize: '1.65rem', color: '#0f172a', marginBottom: '0.5rem' }}>
              Teacher & Administration Portal
            </h2>
            <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '550px' }}>
              Authorized teachers and administrators can access student records, mark daily class attendance, enter exam marks, and verify offline payment slips.
            </p>
          </div>

          <div>
            <button
              onClick={() => alert("Authentication & Login UI will be activated in Phase 3.")}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            >
              Sign In to Staff Portal <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Discreet System Status Bar */}
      <div style={{
        textAlign: 'center',
        padding: '0.75rem',
        fontSize: '0.8rem',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <span>System Status: <strong style={{ color: healthStatus === 'Online' || healthStatus === 'UP' ? '#10b981' : '#e11d48' }}>● {healthStatus}</strong></span>
        <span>•</span>
        <span>Version 1.0.0</span>
        <span>•</span>
        <span>Spring Boot & MySQL 8.0 Active</span>
      </div>
    </div>
  );
}
