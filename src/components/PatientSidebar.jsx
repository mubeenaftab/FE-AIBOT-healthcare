import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Added useNavigate
import PatientDp from '../assets/patient.png';
import { TbMessageChatbot } from "react-icons/tb";
import { jwtDecode } from 'jwt-decode';
import './css/Sidebar.css';

function Sidebar() {
  const [username, setUsername] = useState('');
  const [showEditButton, setShowEditButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.sub) {
          setUsername(decodedToken.sub);
        } else {
          console.error('Subject (sub) not found in decoded token');
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      console.error('No token found in localStorage');
    }
  }, []);

  const handleProfileClick = () => {
    setShowEditButton(!showEditButton);
  };

  const handleEditProfile = () => {
    navigate('/patients/update'); // Navigate to the patient update page
  };

  return (
    <aside className="sidebar">
      <div className="profile" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
        <img src={PatientDp} alt={username || 'Mobeen Chandler'} />
        <h2>{username || 'Admin'}</h2>
        {showEditButton && (
          <button className="edit-profile-btn" onClick={handleEditProfile}>
            Edit Profile
          </button>
        )}
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/chat"
              className={({ isActive }) => (isActive ? "active nav-link" : "nav-link")}
            >
              <TbMessageChatbot className="icon" /> Chat with AI
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="brand">
        <h3>CHEMSA.AI</h3>
      </div>
    </aside>
  );
}

export default Sidebar;
