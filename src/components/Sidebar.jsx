import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PatientDp from '../assets/patient.png';
import { TbMessageChatbot } from "react-icons/tb";
import { jwtDecode } from 'jwt-decode';
import './css/Sidebar.css';

function Sidebar() {
  const [username, setUsername] = useState('');

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

  return (
    <aside className="sidebar">
      <div className="profile">
        <img src={PatientDp} alt={username || 'Mobeen Chandler'} />
        <h2>{username || 'Admin'}</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/chat"
              className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}
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