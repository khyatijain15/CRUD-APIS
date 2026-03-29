import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiUser, FiCalendar } from 'react-icons/fi';
import '../styles/pages/dashboard.css';

const AdminPanel = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const res = await api.get('/tasks/all');
        setTasks(res.data.data.tasks);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTasks();
  }, []);

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <div className="header-title">
          <h1><FiShield /> Admin Panel</h1>
          <p>System-wide task overview</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
          <FiArrowLeft /> Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div className="tasks-grid">
           {[1, 2, 3].map(i => (
             <div key={i} className="task-card skeleton-card">
                <div className="skeleton-line title"></div>
                <div className="skeleton-line desc"></div>
                <div className="skeleton-box"></div>
             </div>
          ))}
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map(task => (
            <div key={task.id} className="task-card animate-slide-up">
              <div className="task-card-header">
                <div className="badges">
                  <span className={`status-badge status-${task.status.toLowerCase()}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              
              <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                <p className="task-desc">{task.description}</p>
              </div>
              
              <div className="task-card-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
                <div className="task-meta" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                   <span style={{ color: 'var(--primary)', fontWeight: '600' }}>
                     <FiUser /> {task.user?.name} ({task.user?.email})
                   </span>
                   {task.dueDate && <span><FiCalendar /> {new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;