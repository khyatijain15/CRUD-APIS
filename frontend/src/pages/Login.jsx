import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { FiMail, FiLock, FiLoader, FiCheckSquare, FiShield, FiZap, FiLayout, FiUsers } from 'react-icons/fi';
import '../styles/pages/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.data.token, res.data.data.user);
      addToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-hero login-hero">
        <div className="hero-content">
          <div className="hero-logo animate-float">
            <FiCheckSquare />
          </div>
          <h1>Manage Tasks Like a Pro</h1>
          <p>The ultimate productivity tool for modern teams and individuals.</p>
          
          <div className="hero-features">
            <div className="feature-item">
              <div className="feature-icon"><FiShield /></div>
              <span>Secure Authentication</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><FiZap /></div>
              <span>Lightning Fast</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><FiLayout /></div>
              <span>Smart Organization</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><FiUsers /></div>
              <span>Role-Based Access</span>
            </div>
          </div>
        </div>
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
      </div>
      
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Please enter your details to sign in.</p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="Ex: john@company.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <FiMail className="input-icon" />
            </div>
            
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="input-label">Password</label>
                <span className="forgot-password">Forgot password?</span>
              </div>
              <input 
                type="password" 
                className="input-field" 
                placeholder="Enter your password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <FiLock className="input-icon" />
            </div>

            <div className="remember-me">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me for 30 days
              </label>
            </div>
            
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <FiLoader className="animate-spin" /> Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register" className="auth-link">Create one now</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;