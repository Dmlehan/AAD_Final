import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  academicYearsApi,
  schoolGradesApi,
  englishLevelsApi,
  classGroupsApi
} from '../api/masterDataApi';
import {
  Calendar,
  Layers,
  GraduationCap,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  RefreshCw,
  Search
} from 'lucide-react';

export default function MasterDataPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  const [activeTab, setActiveTab] = useState('classes'); // 'classes', 'years', 'grades', 'levels'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Master Data States
  const [academicYears, setAcademicYears] = useState([]);
  const [schoolGrades, setSchoolGrades] = useState([]);
  const [englishLevels, setEnglishLevels] = useState([]);
  const [classGroups, setClassGroups] = useState([]);

  // Filter States for Class Groups
  const [filterYear, setFilterYear] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterActiveOnly, setFilterActiveOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [modalType, setModalType] = useState(null); // 'year', 'grade', 'level', 'class'
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Forms
  const [yearForm, setYearForm] = useState({ name: '', startDate: '', endDate: '', active: true });
  const [gradeForm, setGradeForm] = useState({ name: '', displayOrder: 0, active: true });
  const [levelForm, setLevelForm] = useState({ name: '', description: '', displayOrder: 0, active: true });
  const [classForm, setClassForm] = useState({
    name: '',
    academicYearId: '',
    schoolGradeId: '',
    englishLevelId: '',
    dayOfWeek: 'Saturday',
    startTime: '09:00',
    endTime: '11:00',
    roomLocation: '',
    active: true
  });

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [yearsRes, gradesRes, levelsRes] = await Promise.all([
        academicYearsApi.getAll(),
        schoolGradesApi.getAll(),
        englishLevelsApi.getAll()
      ]);
      setAcademicYears(yearsRes.data || []);
      setSchoolGrades(gradesRes.data || []);
      setEnglishLevels(levelsRes.data || []);

      await loadClasses();
    } catch (err) {
      setError(err.message || 'Failed to load master data.');
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      const params = {};
      if (filterYear) params.academicYearId = filterYear;
      if (filterGrade) params.schoolGradeId = filterGrade;
      if (filterLevel) params.englishLevelId = filterLevel;
      if (filterActiveOnly) params.activeOnly = true;

      const classesRes = await classGroupsApi.getAll(params);
      setClassGroups(classesRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load class groups.');
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (activeTab === 'classes') {
      loadClasses();
    }
  }, [filterYear, filterGrade, filterLevel, filterActiveOnly]);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Status Toggles
  const handleToggleYearStatus = async (item) => {
    try {
      await academicYearsApi.toggleStatus(item.id, !item.active);
      showSuccess(`Academic year "${item.name}" status updated.`);
      loadAllData();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const handleToggleGradeStatus = async (item) => {
    try {
      await schoolGradesApi.toggleStatus(item.id, !item.active);
      showSuccess(`School grade "${item.name}" status updated.`);
      loadAllData();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const handleToggleLevelStatus = async (item) => {
    try {
      await englishLevelsApi.toggleStatus(item.id, !item.active);
      showSuccess(`English level "${item.name}" status updated.`);
      loadAllData();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const handleToggleClassStatus = async (item) => {
    try {
      await classGroupsApi.toggleStatus(item.id, !item.active);
      showSuccess(`Class group "${item.name}" status updated.`);
      loadClasses();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  // Delete Handlers
  const handleDeleteYear = async (item) => {
    if (!window.confirm(`Delete academic year "${item.name}"?`)) return;
    try {
      await academicYearsApi.delete(item.id);
      showSuccess(`Academic year deleted.`);
      loadAllData();
    } catch (err) {
      alert(err.message || 'Failed to delete.');
    }
  };

  const handleDeleteGrade = async (item) => {
    if (!window.confirm(`Delete grade "${item.name}"?`)) return;
    try {
      await schoolGradesApi.delete(item.id);
      showSuccess(`Grade deleted.`);
      loadAllData();
    } catch (err) {
      alert(err.message || 'Failed to delete.');
    }
  };

  const handleDeleteLevel = async (item) => {
    if (!window.confirm(`Delete level "${item.name}"?`)) return;
    try {
      await englishLevelsApi.delete(item.id);
      showSuccess(`English level deleted.`);
      loadAllData();
    } catch (err) {
      alert(err.message || 'Failed to delete.');
    }
  };

  const handleDeleteClass = async (item) => {
    if (!window.confirm(`Delete class "${item.name}"?`)) return;
    try {
      await classGroupsApi.delete(item.id);
      showSuccess(`Class deleted.`);
      loadClasses();
    } catch (err) {
      alert(err.message || 'Failed to delete.');
    }
  };

  // Modal Openers
  const openYearModal = (item = null) => {
    setSelectedItem(item);
    setModalMode(item ? 'edit' : 'create');
    setYearForm({
      name: item ? item.name : '',
      startDate: item ? item.startDate : '',
      endDate: item ? item.endDate : '',
      active: item ? item.active : true
    });
    setModalError(null);
    setModalType('year');
  };

  const openGradeModal = (item = null) => {
    setSelectedItem(item);
    setModalMode(item ? 'edit' : 'create');
    setGradeForm({
      name: item ? item.name : '',
      displayOrder: item ? item.displayOrder : schoolGrades.length + 1,
      active: item ? item.active : true
    });
    setModalError(null);
    setModalType('grade');
  };

  const openLevelModal = (item = null) => {
    setSelectedItem(item);
    setModalMode(item ? 'edit' : 'create');
    setLevelForm({
      name: item ? item.name : '',
      description: item ? item.description || '' : '',
      displayOrder: item ? item.displayOrder : englishLevels.length + 1,
      active: item ? item.active : true
    });
    setModalError(null);
    setModalType('level');
  };

  const openClassModal = (item = null) => {
    setSelectedItem(item);
    setModalMode(item ? 'edit' : 'create');
    const defaultYear = academicYears.find(y => y.active)?.id || (academicYears[0]?.id || '');
    setClassForm({
      name: item ? item.name : '',
      academicYearId: item ? item.academicYearId : defaultYear,
      schoolGradeId: item ? item.schoolGradeId || '' : '',
      englishLevelId: item ? item.englishLevelId || '' : '',
      dayOfWeek: item ? item.dayOfWeek : 'Saturday',
      startTime: item ? item.startTime?.substring(0, 5) : '09:00',
      endTime: item ? item.endTime?.substring(0, 5) : '11:00',
      roomLocation: item ? item.roomLocation || '' : '',
      active: item ? item.active : true
    });
    setModalError(null);
    setModalType('class');
  };

  // Modal Submissions
  const handleSubmitYear = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);
    try {
      if (modalMode === 'create') {
        await academicYearsApi.create(yearForm);
        showSuccess('Academic year created successfully.');
      } else {
        await academicYearsApi.update(selectedItem.id, yearForm);
        showSuccess('Academic year updated successfully.');
      }
      setModalType(null);
      loadAllData();
    } catch (err) {
      setModalError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);
    try {
      if (modalMode === 'create') {
        await schoolGradesApi.create(gradeForm);
        showSuccess('School grade created successfully.');
      } else {
        await schoolGradesApi.update(selectedItem.id, gradeForm);
        showSuccess('School grade updated successfully.');
      }
      setModalType(null);
      loadAllData();
    } catch (err) {
      setModalError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitLevel = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);
    try {
      if (modalMode === 'create') {
        await englishLevelsApi.create(levelForm);
        showSuccess('English level created successfully.');
      } else {
        await englishLevelsApi.update(selectedItem.id, levelForm);
        showSuccess('English level updated successfully.');
      }
      setModalType(null);
      loadAllData();
    } catch (err) {
      setModalError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitClass = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);
    try {
      const payload = {
        name: classForm.name,
        academicYearId: Number(classForm.academicYearId),
        schoolGradeId: classForm.schoolGradeId ? Number(classForm.schoolGradeId) : null,
        englishLevelId: classForm.englishLevelId ? Number(classForm.englishLevelId) : null,
        dayOfWeek: classForm.dayOfWeek,
        startTime: classForm.startTime.length === 5 ? `${classForm.startTime}:00` : classForm.startTime,
        endTime: classForm.endTime.length === 5 ? `${classForm.endTime}:00` : classForm.endTime,
        roomLocation: classForm.roomLocation,
        active: classForm.active
      };

      if (modalMode === 'create') {
        await classGroupsApi.create(payload);
        showSuccess('Class group created successfully.');
      } else {
        await classGroupsApi.update(selectedItem.id, payload);
        showSuccess('Class group updated successfully.');
      }
      setModalType(null);
      loadClasses();
    } catch (err) {
      setModalError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredClasses = classGroups.filter(cg => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      cg.name?.toLowerCase().includes(term) ||
      cg.roomLocation?.toLowerCase().includes(term) ||
      cg.dayOfWeek?.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ maxWidth: '1120px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: 700, margin: 0 }}>Academic Master Data</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
            Manage academic years, grade tiers, English proficiency levels, and class group schedules.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={loadAllData}
            disabled={loading}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>
        </div>
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

      {error && (
        <div style={{
          background: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          color: '#be123c',
          marginBottom: '1.25rem',
          fontSize: '0.875rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem', gap: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('classes')}
          style={{
            padding: '0.65rem 1.15rem',
            border: 'none',
            borderBottom: activeTab === 'classes' ? '2px solid var(--primary-600)' : '2px solid transparent',
            background: 'transparent',
            color: activeTab === 'classes' ? 'var(--primary-600)' : '#64748b',
            fontWeight: activeTab === 'classes' ? 600 : 500,
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Clock size={16} /> Class Groups ({classGroups.length})
        </button>
        <button
          onClick={() => setActiveTab('years')}
          style={{
            padding: '0.65rem 1.15rem',
            border: 'none',
            borderBottom: activeTab === 'years' ? '2px solid var(--primary-600)' : '2px solid transparent',
            background: 'transparent',
            color: activeTab === 'years' ? 'var(--primary-600)' : '#64748b',
            fontWeight: activeTab === 'years' ? 600 : 500,
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Calendar size={16} /> Academic Years ({academicYears.length})
        </button>
        <button
          onClick={() => setActiveTab('grades')}
          style={{
            padding: '0.65rem 1.15rem',
            border: 'none',
            borderBottom: activeTab === 'grades' ? '2px solid var(--primary-600)' : '2px solid transparent',
            background: 'transparent',
            color: activeTab === 'grades' ? 'var(--primary-600)' : '#64748b',
            fontWeight: activeTab === 'grades' ? 600 : 500,
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <GraduationCap size={16} /> School Grades ({schoolGrades.length})
        </button>
        <button
          onClick={() => setActiveTab('levels')}
          style={{
            padding: '0.65rem 1.15rem',
            border: 'none',
            borderBottom: activeTab === 'levels' ? '2px solid var(--primary-600)' : '2px solid transparent',
            background: 'transparent',
            color: activeTab === 'levels' ? 'var(--primary-600)' : '#64748b',
            fontWeight: activeTab === 'levels' ? 600 : 500,
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Layers size={16} /> English Levels ({englishLevels.length})
        </button>
      </div>

      {/* TAB 1: CLASS GROUPS */}
      {activeTab === 'classes' && (
        <div>
          {/* Filter Bar */}
          <div className="card" style={{ padding: '1rem', marginBottom: '1.25rem', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.2rem' }}>Academic Year</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                >
                  <option value="">All Academic Years</option>
                  {academicYears.map(y => (
                    <option key={y.id} value={y.id}>{y.name} {y.active ? '(Active)' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.2rem' }}>School Grade</label>
                <select
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                >
                  <option value="">All Grades</option>
                  {schoolGrades.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.2rem' }}>English Level</label>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                >
                  <option value="">All Levels</option>
                  {englishLevels.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.1rem' }}>
                <input
                  type="checkbox"
                  id="activeOnly"
                  checked={filterActiveOnly}
                  onChange={(e) => setFilterActiveOnly(e.target.checked)}
                />
                <label htmlFor="activeOnly" style={{ fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}>Active Classes Only</label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.75rem 0.45rem 2rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              {isAdmin && (
                <button
                  onClick={() => openClassModal()}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  <Plus size={15} /> Add Class Group
                </button>
              )}
            </div>
          </div>

          {/* Classes Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Class Name</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Year / Tier</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Schedule</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Room</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Status</th>
                  {isAdmin && <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>Loading classes...</td>
                  </tr>
                ) : filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
                      No class groups found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((cg) => (
                    <tr key={cg.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{cg.name}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#0f172a' }}>{cg.academicYearName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {cg.schoolGradeName || ''} {cg.englishLevelName ? `• ${cg.englishLevelName}` : ''}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 500, color: '#334155' }}>{cg.dayOfWeek}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {cg.startTime?.substring(0, 5)} - {cg.endTime?.substring(0, 5)}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#475569' }}>{cg.roomLocation || '—'}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.8rem',
                          color: cg.active ? '#15803d' : '#94a3b8',
                          fontWeight: 500
                        }}>
                          {cg.active ? <CheckCircle2 size={13} color="#16a34a" /> : <XCircle size={13} color="#94a3b8" />}
                          {cg.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleToggleClassStatus(cg)}
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              {cg.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => openClassModal(cg)}
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteClass(cg)}
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#b91c1c' }}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ACADEMIC YEARS */}
      {activeTab === 'years' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Academic Years</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>Configure academic sessions and schedule timelines.</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => openYearModal()}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
              >
                <Plus size={15} /> Add Academic Year
              </button>
            )}
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Year Name</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Start Date</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>End Date</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Status</th>
                  {isAdmin && <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {academicYears.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No academic years defined yet.</td>
                  </tr>
                ) : (
                  academicYears.map((y) => (
                    <tr key={y.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>{y.name}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{y.startDate}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{y.endDate}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.8rem',
                          color: y.active ? '#15803d' : '#94a3b8',
                          fontWeight: 500
                        }}>
                          {y.active ? <CheckCircle2 size={13} color="#16a34a" /> : <XCircle size={13} color="#94a3b8" />}
                          {y.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleToggleYearStatus(y)}
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              {y.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => openYearModal(y)}
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteYear(y)}
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#b91c1c' }}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SCHOOL GRADES */}
      {activeTab === 'grades' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>School Grades</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>Manage school grade levels and display sorting order.</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => openGradeModal()}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
              >
                <Plus size={15} /> Add School Grade
              </button>
            )}
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Grade Name</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Display Order</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Status</th>
                  {isAdmin && <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {schoolGrades.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No school grades defined yet.</td>
                  </tr>
                ) : (
                  schoolGrades.map((g) => (
                    <tr key={g.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>{g.name}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{g.displayOrder}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.8rem',
                          color: g.active ? '#15803d' : '#94a3b8',
                          fontWeight: 500
                        }}>
                          {g.active ? <CheckCircle2 size={13} color="#16a34a" /> : <XCircle size={13} color="#94a3b8" />}
                          {g.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleToggleGradeStatus(g)}
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              {g.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => openGradeModal(g)}
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteGrade(g)}
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#b91c1c' }}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ENGLISH LEVELS */}
      {activeTab === 'levels' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>English Levels</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>Configure language stages (Starters, Movers, Flyers, etc.).</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => openLevelModal()}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
              >
                <Plus size={15} /> Add English Level
              </button>
            )}
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Level Name</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Description</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Order</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Status</th>
                  {isAdmin && <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {englishLevels.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No English levels defined yet.</td>
                  </tr>
                ) : (
                  englishLevels.map((l) => (
                    <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>{l.name}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{l.description || '—'}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{l.displayOrder}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.8rem',
                          color: l.active ? '#15803d' : '#94a3b8',
                          fontWeight: 500
                        }}>
                          {l.active ? <CheckCircle2 size={13} color="#16a34a" /> : <XCircle size={13} color="#94a3b8" />}
                          {l.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleToggleLevelStatus(l)}
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              {l.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => openLevelModal(l)}
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteLevel(l)}
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#b91c1c' }}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ACADEMIC YEAR */}
      {modalType === 'year' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#0f172a' }}>
              {modalMode === 'create' ? 'Add Academic Year' : 'Edit Academic Year'}
            </h3>
            {modalError && <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', padding: '0.65rem', color: '#be123c', fontSize: '0.8rem', marginBottom: '1rem' }}>{modalError}</div>}
            <form onSubmit={handleSubmitYear}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Year Name</label>
                <input
                  type="text"
                  required
                  value={yearForm.name}
                  onChange={(e) => setYearForm({ ...yearForm, name: e.target.value })}
                  placeholder="e.g. 2026 Academic Year"
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Start Date</label>
                  <input
                    type="date"
                    required
                    value={yearForm.startDate}
                    onChange={(e) => setYearForm({ ...yearForm, startDate: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>End Date</label>
                  <input
                    type="date"
                    required
                    value={yearForm.endDate}
                    onChange={(e) => setYearForm({ ...yearForm, endDate: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn btn-secondary" disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Year'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SCHOOL GRADE */}
      {modalType === 'grade' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#0f172a' }}>
              {modalMode === 'create' ? 'Add School Grade' : 'Edit School Grade'}
            </h3>
            {modalError && <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', padding: '0.65rem', color: '#be123c', fontSize: '0.8rem', marginBottom: '1rem' }}>{modalError}</div>}
            <form onSubmit={handleSubmitGrade}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Grade Name</label>
                <input
                  type="text"
                  required
                  value={gradeForm.name}
                  onChange={(e) => setGradeForm({ ...gradeForm, name: e.target.value })}
                  placeholder="e.g. Grade 1"
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Display Order</label>
                <input
                  type="number"
                  required
                  value={gradeForm.displayOrder}
                  onChange={(e) => setGradeForm({ ...gradeForm, displayOrder: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn btn-secondary" disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Grade'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ENGLISH LEVEL */}
      {modalType === 'level' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#0f172a' }}>
              {modalMode === 'create' ? 'Add English Level' : 'Edit English Level'}
            </h3>
            {modalError && <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', padding: '0.65rem', color: '#be123c', fontSize: '0.8rem', marginBottom: '1rem' }}>{modalError}</div>}
            <form onSubmit={handleSubmitLevel}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Level Name</label>
                <input
                  type="text"
                  required
                  value={levelForm.name}
                  onChange={(e) => setLevelForm({ ...levelForm, name: e.target.value })}
                  placeholder="e.g. Starters (Pre-A1)"
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Description</label>
                <input
                  type="text"
                  value={levelForm.description}
                  onChange={(e) => setLevelForm({ ...levelForm, description: e.target.value })}
                  placeholder="e.g. Cambridge Young Learners introductory level"
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Display Order</label>
                <input
                  type="number"
                  required
                  value={levelForm.displayOrder}
                  onChange={(e) => setLevelForm({ ...levelForm, displayOrder: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn btn-secondary" disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Level'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CLASS GROUP */}
      {modalType === 'class' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#0f172a' }}>
              {modalMode === 'create' ? 'Add Class Group' : 'Edit Class Group'}
            </h3>
            {modalError && <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', padding: '0.65rem', color: '#be123c', fontSize: '0.8rem', marginBottom: '1rem' }}>{modalError}</div>}
            <form onSubmit={handleSubmitClass}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Class Group Name</label>
                <input
                  type="text"
                  required
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  placeholder="e.g. Starters Saturday Batch A"
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Academic Year</label>
                  <select
                    required
                    value={classForm.academicYearId}
                    onChange={(e) => setClassForm({ ...classForm, academicYearId: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#fff' }}
                  >
                    <option value="">Select Year</option>
                    {academicYears.map(y => (
                      <option key={y.id} value={y.id}>{y.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>School Grade (Optional)</label>
                  <select
                    value={classForm.schoolGradeId}
                    onChange={(e) => setClassForm({ ...classForm, schoolGradeId: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#fff' }}
                  >
                    <option value="">None / Not Applicable</option>
                    {schoolGrades.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>English Level (Optional)</label>
                  <select
                    value={classForm.englishLevelId}
                    onChange={(e) => setClassForm({ ...classForm, englishLevelId: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#fff' }}
                  >
                    <option value="">None / Not Applicable</option>
                    {englishLevels.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Day of Week</label>
                  <select
                    required
                    value={classForm.dayOfWeek}
                    onChange={(e) => setClassForm({ ...classForm, dayOfWeek: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#fff' }}
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Start Time</label>
                  <input
                    type="time"
                    required
                    value={classForm.startTime}
                    onChange={(e) => setClassForm({ ...classForm, startTime: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>End Time</label>
                  <input
                    type="time"
                    required
                    value={classForm.endTime}
                    onChange={(e) => setClassForm({ ...classForm, endTime: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Room / Location</label>
                <input
                  type="text"
                  value={classForm.roomLocation}
                  onChange={(e) => setClassForm({ ...classForm, roomLocation: e.target.value })}
                  placeholder="e.g. Room A1, 1st Floor"
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn btn-secondary" disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Class'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
