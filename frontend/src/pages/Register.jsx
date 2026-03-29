import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

import { FiUser, FiMail, FiLock, FiLoader, FiShield, FiTrendingUp, FiActivity, FiStar, FiCheck } from 'react-icons/fi';
import '../styles/pages/auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();
  const strengthText = strength === 0 ? 'Weak' : strength === 1 ? 'Poor' : strength === 2 ? 'Medium' : 'Strong';
  const strengthColor = strength === 0 ? 'var(--gray-300)' : strength === 1 ? 'var(--error)' : strength === 2 ? 'var(--warning)' : 'var(--success)';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return addToast('Password must be at least 6 characters', 'error');
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      
      // Auto login after registration
      const loginRes = await api.post('/auth/login', { email, password });
      login(loginRes.data.data.token, loginRes.data.data.user);
      
      addToast('Registration successful! Welcome to the dashboard.', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || err.response?.data?.error || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-hero register-hero">
        <div className="hero-content">
          <div className="hero-logo animate-float">
            <FiStar />
          </div>
          <h1>Join the Revolution</h1>
          <p>Get started today and supercharge your team's productivity.</p>
          
          <div className="hero-features">
            <div className="feature-item">
              <div className="feature-icon"><FiTrendingUp /></div>
              <span>Boost Productivity 10x</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><FiActivity /></div>
              <span>Real-time Sync</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><FiShield /></div>
              <span>Bank-level Security</span>
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
            <h2>Create Account</h2>
            <p>Fill in your details to get started.</p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Ex: John Doe"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
              <FiUser className="input-icon" />
            </div>

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
              <label className="input-label">Password</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="Create a strong password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <FiLock className="input-icon" />
            </div>

            {password.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                  <span>Password strength:</span>
                  <span style={{ color: strengthColor, fontWeight: 600 }}>{strengthText}</span>
                </div>
                <div style={{ height: '4px', background: 'var(--gray-200)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: strength === 0 ? '10%' : strength === 1 ? '33%' : strength === 2 ? '66%' : '100%',
                    background: strengthColor,
                    transition: 'all 0.3s ease-in-out'
                  }}></div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <li style={{ color: password.length >= 8 ? 'var(--success)' : 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiCheck /> At least 8 characters
                  </li>
                  <li style={{ color: /[A-Z]/.test(password) ? 'var(--success)' : 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiCheck /> One uppercase letter
                  </li>
                  <li style={{ color: /[0-9]/.test(password) ? 'var(--success)' : 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiCheck /> One number
                  </li>
                </ul>
              </div>
            )}

            <div className="remember-me">
              <label className="checkbox-container">
                <input type="checkbox" required />
                <span className="checkmark"></span>
                I agree to the Terms & Conditions
              </label>
            </div>
            
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <FiLoader className="animate-spin" /> Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Log in instead</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;