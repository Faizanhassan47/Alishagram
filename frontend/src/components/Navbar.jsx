import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { X, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const isActive = (path) => location.pathname === path;

  const handleLinkClick = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav className="navbar-minimal">
        <Link to="/" className="brand-minimal">
          Alishagram
        </Link>

        <div className="menu-toggle" onClick={toggleMenu}>
          <span>Menu</span>
          <Menu size={24} />
        </div>
      </nav>

      {/* Drawer Overlay */}
      <div className={`menu-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <span>MENU</span>
          <div className="close-btn" onClick={toggleMenu}>
            <span>CLOSE</span>
            <div className="close-icon-wrapper">
              <X size={20} />
            </div>
          </div>
        </div>

        <div className="drawer-links">
          <div className={`drawer-link ${isActive('/') ? 'active' : ''}`} onClick={() => handleLinkClick('/')}>
            Home
          </div>
          <div className={`drawer-link ${isActive('/search') ? 'active' : ''}`} onClick={() => handleLinkClick('/search')}>
            Explore
          </div>
          {user && (
            <div className={`drawer-link ${isActive('/upload') ? 'active' : ''}`} onClick={() => handleLinkClick('/upload')}>
              Upload
            </div>
          )}
          {!user ? (
            <>
              <div className="drawer-link" onClick={() => handleLinkClick('/login')}>Login</div>
              <div className="drawer-link signup-special" onClick={() => handleLinkClick('/register')}>Sign Up</div>
            </>
          ) : (
            <div className="drawer-link" onClick={() => { logout(); setIsOpen(false); }}>Logout</div>
          )}
        </div>

      </div>

    </>
  );
};

export default Navbar;


