import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiSettings, FiUser, FiMenu, FiX, FiCheckSquare } from 'react-icons/fi';
import '../styles/components/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <div className="brand-icon">
            <FiCheckSquare />
          </div>
          <span className="brand-text">TaskMaster</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-links desktop-only">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          {user.role === 'admin' && (
            <Link to="/admin" className="nav-link">All Tasks</Link>
          )}
        </div>

        <div className="navbar-right desktop-only">
          <div className="profile-menu">
            <button 
              className="profile-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            >
              <div className="avatar">
                {user.name.charAt(0).toUpperCase()}
                <span className="status-indicator"></span>
              </div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item">
                  <FiUser /> Profile
                </div>
                <div className="dropdown-item">
                  <FiSettings /> Settings
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item text-danger" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu Sidebar */}
      <div className={`mobile-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-profile">
          <div className="avatar large">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="mobile-user-details">
            <span className="mobile-name">{user.name}</span>
            <span className="mobile-email">{user.email}</span>
          </div>
        </div>
        <div className="mobile-links">
          <Link to="/dashboard" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
            Dashboard
          </Link>
          {user.role === 'admin' && (
            <Link to="/admin" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
              All Tasks
            </Link>
          )}
        </div>
        <button className="mobile-logout-btn" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
      {isMenuOpen && <div className="mobile-overlay" onClick={() => setIsMenuOpen(false)}></div>}
    </nav>
  );
};

export default Navbar;