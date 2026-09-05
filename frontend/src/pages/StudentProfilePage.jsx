import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import studentApi from '../api/studentApi';
import enrollmentApi from '../api/enrollmentApi';
import { schoolGradesApi, classGroupsApi } from '../api/masterDataApi';
import {
  User,
  Users,
  Calendar,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  BookOpen,
  RefreshCw
} from 'lucide-react';

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Edit Student Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Add Guardian Modal
  const [showGuardianModal, setShowGuardianModal] = useState(false);
  const [guardianForm, setGuardianForm] = useState({
    name: '',
    relationship: 'Father',
    phone: '',
    email: '',
    address: '',
    isPrimary: false
  });

  // Enroll Class Modal
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    classGroupId: '',
    enrollmentDate: new Date().toISOString().substring(0, 10),
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  const loadStudent = async () => {
    setLoading(true);
    setError(null);
    try {
      const [studentRes, gradesRes, classesRes] = await Promise.all([
        studentApi.getById(id),
        schoolGradesApi.getAll(true),
        classGroupsApi.getAll({ activeOnly: true })
      ]);
      setStudent(studentRes.data);
      setGrades(gradesRes.data || []);
      setAvailableClasses(classesRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load student profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudent();
  }, [id]);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Toggle Active Status
  const handleToggleStatus = async () => {
    try {
      await studentApi.toggleStatus(student.id, !student.active);
      showSuccess(`Student status updated to ${!student.active ? 'Active' : 'Inactive'}.`);
      loadStudent();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  // Open Edit Modal
  const openEditModal = () => {
    setEditFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth || '',
      gender: student.gender || 'MALE',
      schoolGradeId: student.schoolGradeId || '',
      phone: student.phone || '',
      email: student.email || '',
      address: student.address || '',
      notes: student.notes || '',
      active: student.active
    });
    setModalError(null);
    setShowEditModal(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);
    try {
      await studentApi.update(student.id, {
        ...editFormData,
        schoolGradeId: editFormData.schoolGradeId ? Number(editFormData.schoolGradeId) : null
      });
      setShowEditModal(false);
      showSuccess('Student profile updated successfully.');
      loadStudent();
    } catch (err) {
      setModalError(err.message || 'Failed to update student profile.');
    } finally {
      setSubmitting(false);
    }
  };

  // Guardian Management
  const handleAddGuardian = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);
    try {
      await studentApi.addGuardian(student.id, guardianForm);
      setShowGuardianModal(false);
      setGuardianForm({ name: '', relationship: 'Father', phone: '', email: '', address: '', isPrimary: false });
      showSuccess('Guardian added successfully.');
      loadStudent();
    } catch (err) {
      setModalError(err.message || 'Failed to add guardian.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDetachGuardian = async (guardianId) => {
    if (!window.confirm('Remove this guardian from student?')) return;
    try {
      await studentApi.detachGuardian(student.id, guardianId);
      showSuccess('Guardian detached.');
      loadStudent();
    } catch (err) {
      alert(err.message || 'Failed to detach guardian.');
    }
  };

  // Class Enrollment Management
  const handleEnrollClass = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);
    try {
      await enrollmentApi.enroll({
        studentId: student.id,
        classGroupId: Number(enrollForm.classGroupId),
        enrollmentDate: enrollForm.enrollmentDate,
        notes: enrollForm.notes
      });
      setShowEnrollModal(false);
      showSuccess('Student enrolled in class successfully.');
      loadStudent();
    } catch (err) {
      setModalError(err.message || 'Failed to enroll student.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateEnrollmentStatus = async (enrollmentId, newStatus) => {
    try {
      await enrollmentApi.updateStatus(enrollmentId, { status: newStatus });
      showSuccess(`Enrollment status changed to ${newStatus}.`);
      loadStudent();
    } catch (err) {
      alert(err.message || 'Failed to update enrollment status.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#64748b' }}>
        Loading student record...
      </div>
    );
  }

  if (error || !student) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }} className="card">
        <AlertCircle size={36} color="#be123c" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.25rem', color: '#0f172a' }}>Student Profile Not Found</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/students" className="btn btn-primary">Return to Students Directory</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1120px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Back Link */}
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/students" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Back to Student Directory
        </Link>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          color: '#15803d',
          marginBottom: '1.25rem',
          fontSize: '0.875rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Student Profile Header Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#fef3c7',
              color: 'var(--primary-600)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.4rem'
            }}>
              {student.firstName?.[0]}{student.lastName?.[0]}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h1 style={{ fontSize: '1.6rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>{student.fullName}</h1>
                <span style={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  {student.studentCode}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '999px',
                  background: student.active ? '#dcfce7' : '#f1f5f9',
                  color: student.active ? '#15803d' : '#64748b',
                  fontWeight: 600
                }}>
                  {student.active ? <CheckCircle2 size={12} color="#16a34a" /> : <XCircle size={12} color="#94a3b8" />}
                  {student.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', color: '#64748b', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                {student.schoolGradeName && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <GraduationCap size={14} /> {student.schoolGradeName}
                  </span>
                )}
                {student.dateOfBirth && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={14} /> DOB: {student.dateOfBirth}
                  </span>
                )}
                {student.gender && (
                  <span>Gender: {student.gender}</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleToggleStatus}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              {student.active ? 'Deactivate Student' : 'Activate Student'}
            </button>
            <button
              onClick={openEditModal}
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Edit2 size={13} /> Edit Profile
            </button>
          </div>
        </div>

        {/* Contact & Address Sub-strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
          <div>
            <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem', marginBottom: '0.15rem' }}>Phone</span>
            <div style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={13} color="#64748b" /> {student.phone || '—'}
            </div>
          </div>
          <div>
            <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem', marginBottom: '0.15rem' }}>Email</span>
            <div style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={13} color="#64748b" /> {student.email || '—'}
            </div>
          </div>
          <div>
            <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem', marginBottom: '0.15rem' }}>Address</span>
            <div style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={13} color="#64748b" /> {student.address || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Left Column Guardians, Right Column Enrollments */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* LEFT COLUMN: GUARDIANS */}
        <div className="card" style={{ padding: '1.25rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={16} /> Guardians & Parents ({student.guardians?.length || 0})
            </h2>
            <button
              onClick={() => setShowGuardianModal(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Plus size={13} /> Add Guardian
            </button>
          </div>

          {student.guardians?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
              No guardian or parent records attached yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {student.guardians.map((g) => (
                <div key={g.linkId} style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{g.name}</span>
                        {g.primary && (
                          <span style={{
                            background: '#fef3c7',
                            color: '#92400e',
                            fontSize: '0.65rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '999px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem'
                          }}>
                            <ShieldCheck size={10} /> PRIMARY
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{g.relationship}</span>
                    </div>

                    <button
                      onClick={() => handleDetachGuardian(g.guardianId)}
                      className="btn btn-secondary"
                      style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem', color: '#b91c1c' }}
                      title="Detach Guardian"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Phone size={12} color="#94a3b8" /> {g.phone}
                    </div>
                    {g.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                        <Mail size={12} color="#94a3b8" /> {g.email}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CLASS ENROLLMENTS */}
        <div className="card" style={{ padding: '1.25rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={16} /> Class Enrollments ({student.enrollments?.length || 0})
            </h2>
            <button
              onClick={() => setShowEnrollModal(true)}
              className="btn btn-primary"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Plus size={13} /> Enroll in Class
            </button>
          </div>

          {student.enrollments?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
              This student is not enrolled in any class groups yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {student.enrollments.map((e) => (
                <div key={e.id} style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{e.classGroupName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {e.academicYearName} • {e.dayOfWeek} {e.startTime?.substring(0, 5)} - {e.endTime?.substring(0, 5)} {e.roomLocation ? `(${e.roomLocation})` : ''}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '999px',
                        background: e.status === 'ACTIVE' ? '#dcfce7' : e.status === 'COMPLETED' ? '#e0f2fe' : '#fee2e2',
                        color: e.status === 'ACTIVE' ? '#15803d' : e.status === 'COMPLETED' ? '#0369a1' : '#b91c1c'
                      }}>
                        {e.status}
                      </span>

                      {e.status === 'ACTIVE' ? (
                        <button
                          onClick={() => handleUpdateEnrollmentStatus(e.id, 'DROPPED')}
                          className="btn btn-secondary"
                          style={{ padding: '0.2rem 0.45rem', fontSize: '0.7rem' }}
                        >
                          Mark Dropped
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateEnrollmentStatus(e.id, 'ACTIVE')}
                          className="btn btn-secondary"
                          style={{ padding: '0.2rem 0.45rem', fontSize: '0.7rem' }}
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#64748b' }}>
                    Enrolled on: {e.enrollmentDate} {e.notes ? `• Note: ${e.notes}` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EDIT STUDENT MODAL */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#0f172a' }}>Edit Student Profile</h3>
            {modalError && <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', padding: '0.65rem', color: '#be123c', fontSize: '0.8rem', marginBottom: '1rem' }}>{modalError}</div>}
            <form onSubmit={handleUpdateStudent}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.2rem' }}>First Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.2rem' }}>Last Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.2rem' }}>School Grade</label>
                  <select
                    value={editFormData.schoolGradeId}
                    onChange={(e) => setEditFormData({ ...editFormData, schoolGradeId: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                  >
                    <option value="">None</option>
                    {grades.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.2rem' }}>Gender</label>
                  <select
                    value={editFormData.gender}
                    onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.2rem' }}>Phone</label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.2rem' }}>Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.2rem' }}>Address</label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-secondary" disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD GUARDIAN MODAL */}
      {showGuardianModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '460px', width: '100%', padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#0f172a' }}>Add Guardian / Parent</h3>
            {modalError && <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', padding: '0.65rem', color: '#be123c', fontSize: '0.8rem', marginBottom: '1rem' }}>{modalError}</div>}
            <form onSubmit={handleAddGuardian}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.2rem' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={guardianForm.name}
                  onChange={(e) => setGuardianForm({ ...guardianForm, name: e.target.value })}
                  placeholder="e.g. Priyantha Silva"
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.2rem' }}>Relationship *</label>
                  <select
                    value={guardianForm.relationship}
                    onChange={(e) => setGuardianForm({ ...guardianForm, relationship: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Legal Guardian</option>
                    <option value="Relative">Relative</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.2rem' }}>Phone *</label>
                  <input
                    type="text"
                    required
                    value={guardianForm.phone}
                    onChange={(e) => setGuardianForm({ ...guardianForm, phone: e.target.value })}
                    placeholder="0771234567"
                    style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.2rem' }}>Email (Optional)</label>
                <input
                  type="email"
                  value={guardianForm.email}
                  onChange={(e) => setGuardianForm({ ...guardianForm, email: e.target.value })}
                  placeholder="parent@gmail.com"
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input
                  type="checkbox"
                  id="primaryGuardianCheck"
                  checked={guardianForm.isPrimary}
                  onChange={(e) => setGuardianForm({ ...guardianForm, isPrimary: e.target.checked })}
                />
                <label htmlFor="primaryGuardianCheck" style={{ fontSize: '0.8rem', color: '#334155', cursor: 'pointer' }}>Designate as Primary Emergency Contact</label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowGuardianModal(false)} className="btn btn-secondary" disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Attaching...' : 'Attach Guardian'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ENROLL IN CLASS MODAL */}
      {showEnrollModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#0f172a' }}>Enroll Student in Class Group</h3>
            {modalError && <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', padding: '0.65rem', color: '#be123c', fontSize: '0.8rem', marginBottom: '1rem' }}>{modalError}</div>}
            <form onSubmit={handleEnrollClass}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.2rem' }}>Select Class Group *</label>
                <select
                  required
                  value={enrollForm.classGroupId}
                  onChange={(e) => setEnrollForm({ ...enrollForm, classGroupId: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                >
                  <option value="">-- Choose Class Group --</option>
                  {availableClasses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.academicYearName} • {c.dayOfWeek} {c.startTime?.substring(0, 5)})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.2rem' }}>Enrollment Date *</label>
                <input
                  type="date"
                  required
                  value={enrollForm.enrollmentDate}
                  onChange={(e) => setEnrollForm({ ...enrollForm, enrollmentDate: e.target.value })}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.2rem' }}>Notes (Optional)</label>
                <input
                  type="text"
                  value={enrollForm.notes}
                  onChange={(e) => setEnrollForm({ ...enrollForm, notes: e.target.value })}
                  placeholder="e.g. Registered with sibling discount"
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowEnrollModal(false)} className="btn btn-secondary" disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Enrolling...' : 'Confirm Enrollment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
