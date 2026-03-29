import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { 
  FiPlus, FiFilter, FiCheckCircle, FiClock, FiAlertCircle, 
  FiMoreVertical, FiEdit2, FiTrash2, FiCalendar, FiUser, FiSearch
} from 'react-icons/fi';
import '../styles/pages/dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'MEDIUM',
    dueDate: ''
  });

  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get(filter === 'ALL' ? '/tasks' : `/tasks?status=${filter}`);
      
      let fetchedTasks = [];
      if (res.data?.data?.tasks) fetchedTasks = res.data.data.tasks;
      else if (Array.isArray(res.data?.data)) fetchedTasks = res.data.data;
      else if (Array.isArray(res.data)) fetchedTasks = res.data;
      
      setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      addToast('Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };

      if (editTask) {
        await api.put(`/tasks/${editTask.id}`, payload);
        addToast('Task updated successfully', 'success');
      } else {
        await api.post('/tasks', payload);
        addToast('Task created successfully', 'success');
      }
      setShowModal(false);
      resetForm();
      fetchTasks();
    } catch (err) {
      addToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        addToast('Task deleted successfully', 'success');
        fetchTasks();
      } catch (err) {
        addToast('Failed to delete task', 'error');
      }
    }
  };

  const resetForm = () => {
    setEditTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'MEDIUM',
      dueDate: ''
    });
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = (task.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filter === 'ALL' || task.status === filter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Header section */}
      <div className="dashboard-header">
        <div className="header-title">
          <h1>My Tasks</h1>
          <p>Organize, manage, and track your work efficiently.</p>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <FiPlus /> New Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
            <FiFilter size={24} />
          </div>
          <div className="stat-content">
            <p>Total Tasks</p>
            <h3>{tasks.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)' }}>
            <FiCheckCircle size={24} />
          </div>
          <div className="stat-content">
            <p>Completed</p>
            <h3>{tasks.filter(t => t.status === 'done').length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(234, 179, 8, 0.1)', color: 'var(--warning)' }}>
            <FiClock size={24} />
          </div>
          <div className="stat-content">
            <p>In Progress</p>
            <h3>{tasks.filter(t => t.status === 'in_progress').length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}>
            <FiAlertCircle size={24} />
          </div>
          <div className="stat-content">
            <p>Pending</p>
            <h3>{tasks.filter(t => t.status === 'pending').length}</h3>
          </div>
        </div>
      </div>

      {/* Controls: Search & Filters */}
      <div className="dashboard-controls">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search tasks by title or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          {['ALL', 'pending', 'in_progress', 'done'].map(f => (
            <button 
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Task Grid & Skeleton View */}
      {loading ? (
        <div className="tasks-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
             <div key={i} className="task-card skeleton-card">
                <div className="skeleton-line title"></div>
                <div className="skeleton-line desc"></div>
                <div className="skeleton-line desc"></div>
                <div className="skeleton-box"></div>
             </div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-large animate-float">
            <FiCheckCircle size={64} />
          </div>
          <h3>All caught up!</h3>
          <p>You have no tasks matching the current filters. Time for a coffee break!</p>
          <button className="btn-secondary" onClick={() => { resetForm(); setShowModal(true); }}>
            <FiPlus /> Create a Task
          </button>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map((task) => (
            <div key={task.id} className="task-card animate-slide-up">
              <div className="task-card-header">
                <div className="badges">
                  <span className={`status-badge status-${(task.status || 'pending').toLowerCase()}`}>
                    {(task.status || 'pending').replace('_', ' ')}
                  </span>
                  <span className={`priority-badge priority-${(task.priority || 'MEDIUM').toLowerCase()}`}>
                    {task.priority || 'MEDIUM'}
                  </span>
                </div>
                
                <div className="task-actions">
                  <button className="icon-btn tooltip" data-tooltip="Edit" onClick={() => openEditModal(task)}>
                    <FiEdit2 />
                  </button>
                  <button className="icon-btn text-error tooltip" data-tooltip="Delete" onClick={() => handleDelete(task.id)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              
              <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                <p className="task-desc">{task.description}</p>
              </div>
              
              <div className="task-card-footer">
                <div className="task-meta">
                  <FiCalendar /> 
                  <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                </div>
              </div>
              
              <div className="task-progress-bar">
                <div className="progress-fill" style={{ 
                    width: (task.status || 'pending') === 'done' ? '100%' : (task.status || 'pending') === 'in_progress' ? '50%' : '10%',
                    backgroundColor: (task.status || 'pending') === 'done' ? 'var(--success)' : (task.status || 'pending') === 'in_progress' ? 'var(--primary)' : 'var(--gray-300)'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Modal Overlay */}
      {showModal && (
        <div className="modal-overlay animate-fade-in" onClick={(e) => {
          if (e.target.className.includes('modal-overlay')) setShowModal(false);
        }}>
          <div className="modal-content animate-slide-up">
            <div className="modal-header">
              <h2>{editTask ? 'Edit Task' : 'Create New Task'}</h2>
              <button type="button" className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleCreateOrUpdate} className="modal-form">
              <div className="input-group">
                <label className="input-label">Task Title</label>
                <input 
                  type="text" 
                  className="input-field"
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter a descriptive title"
                  required 
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea 
                  className="input-field"
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Add details about this task"
                  rows="4"
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="input-group half">
                  <label className="input-label">Status</label>
                  <select 
                    className="input-field" 
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                </div>
                
                <div className="input-group half">
                  <label className="input-label">Priority</label>
                  <select 
                    className="input-field" 
                    value={formData.priority} 
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              
              <div className="input-group">
                <label className="input-label">Due Date</label>
                <input 
                  type="date" 
                  className="input-field"
                  value={formData.dueDate} 
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;