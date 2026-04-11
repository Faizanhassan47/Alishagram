import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Search, User, LogIn, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchNotifs = async () => {
        try {
          const { data } = await api.get('/notifications');
          setNotifications(data);
        } catch (e) {
          console.error(e);
        }
      };
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 15000); // Check every 15s
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markRead = async (id, photoId) => {
    await api.post(`/notifications/${id}/read`);
    setShowDropdown(false);
    navigate(`/photo/${photoId}`);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  return (
    <nav className="navbar glass">
      <div className="container nav-content">
        <Link to="/" className="brand">
          <Camera className="brand-icon" />
          <span>TripLens</span>
        </Link>
        <div className="nav-links">
          <Link to="/search" className="nav-link"><Search size={18}/> Explore</Link>
          {user ? (
            <>
              {user.role === 'creator' && <Link to="/upload" className="btn btn-primary"><Camera size={18}/> Upload</Link>}
              
              <div style={{ position: 'relative' }}>
                <button className="icon-btn" onClick={() => setShowDropdown(!showDropdown)} style={{ background: 'transparent', width: '32px', height: '32px' }}>
                  <Bell size={20} color="var(--text-primary)" />
                  {unreadCount > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: 'var(--danger)', color: 'white', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '10px' }}>{unreadCount}</span>}
                </button>
                
                {showDropdown && (
                  <div className="glass-card" style={{ position: 'absolute', right: 0, top: '40px', width: '300px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={{ margin: 0, marginBottom: '8px' }}>Notifications</h4>
                    {notifications.length === 0 ? <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No notifications yet.</p> : null}
                    {notifications.map(n => (
                      <div key={n._id} onClick={() => markRead(n._id, n.photoId?._id)} style={{ padding: '8px', background: n.isRead ? 'transparent' : 'rgba(255,255,255,0.05)', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem' }}>
                        <strong style={{ color: 'var(--primary)' }}>{n.actorId?.name}</strong> {n.type === 'comment' ? 'commented on' : 'rated'} your photo <strong>{n.photoId?.title}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <span className="nav-link"><User size={18}/> {user.name}</span>
              <button onClick={handleLogout} className="btn btn-outline"><LogOut size={18}/> Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline"><LogIn size={18}/> Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
