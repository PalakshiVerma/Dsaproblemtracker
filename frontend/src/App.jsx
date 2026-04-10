import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = '/api/problems';

function App() {
  const [problems, setProblems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    platform: 'LeetCode',
    difficulty: 'Easy',
    topic: '',
    status: 'Need Practice',
    notes: ''
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchProblems();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving problem:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchProblems();
      } catch (error) {
        console.error('Error deleting problem:', error);
      }
    }
  };

  const openModal = (problem = null) => {
    if (problem) {
      setFormData(problem);
      setEditingId(problem._id);
    } else {
      setFormData({
        title: '',
        platform: 'LeetCode',
        difficulty: 'Easy',
        topic: '',
        status: 'Need Practice',
        notes: ''
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const stats = {
    total: problems.length,
    easy: problems.filter(p => p.difficulty === 'Easy').length,
    medium: problems.filter(p => p.difficulty === 'Medium').length,
    hard: problems.filter(p => p.difficulty === 'Hard').length,
    solved: problems.filter(p => p.status === 'Solved').length
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1>DSA Mastery Tracker</h1>
          <p style={{ color: 'var(--text-muted)' }}>Master the algorithms, one problem at a time.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>+ Add Problem</button>
      </header>

      <section className="dashboard-grid">
        <div className="glass-panel stat-card">
          <span className="stat-label">Total Solved</span>
          <span className="stat-value" style={{ color: 'var(--success)' }}>{stats.solved} / {stats.total}</span>
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-label">Difficulty Mix</span>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <span className="badge badge-easy">E: {stats.easy}</span>
            <span className="badge badge-medium">M: {stats.medium}</span>
            <span className="badge badge-hard">H: {stats.hard}</span>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-label">Current Streak</span>
          <span className="stat-value" style={{ color: 'var(--secondary)' }}>7 Days</span>
        </div>
      </section>

      <main className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Platform</th>
              <th>Topic</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map(problem => (
              <tr key={problem._id}>
                <td style={{ fontWeight: '600' }}>{problem.title}</td>
                <td style={{ color: 'var(--text-muted)' }}>{problem.platform}</td>
                <td><span className="badge btn-outline">{problem.topic}</span></td>
                <td>
                  <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td>
                  <span className={`status-${problem.status.replace(' ', '-').toLowerCase()}`}>
                    {problem.status === 'Solved' ? '● Solved' : problem.status === 'Revisiting' ? '○ Revisiting' : '◌ Need Practice'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openModal(problem)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>Edit</button>
                    <button onClick={() => handleDelete(problem._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {problems.length === 0 && (
          <div style={{ padding: '4rem', textAlignment: 'center', color: 'var(--text-muted)' }}>
            No problems tracked yet. Start by adding one!
          </div>
        )}
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Problem' : 'Add New Problem'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Problem Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Reverse Binary Tree"
                  required 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Platform</label>
                  <select value={formData.platform} onChange={(e) => setFormData({...formData, platform: e.target.value})}>
                    <option>LeetCode</option>
                    <option>GeeksforGeeks</option>
                    <option>Codeforces</option>
                    <option>HackerRank</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: e.target.value})}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Topic</label>
                  <input 
                    type="text" 
                    value={formData.topic} 
                    onChange={(e) => setFormData({...formData, topic: e.target.value})} 
                    placeholder="e.g. Graphs"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option>Need Practice</option>
                    <option>Revisiting</option>
                    <option>Solved</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea 
                  rows="3" 
                  value={formData.notes} 
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Key insights, complexity..."
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? 'Update' : 'Add'} Problem</button>
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
