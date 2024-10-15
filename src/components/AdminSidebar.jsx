import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import AdminDp from '../assets/admin.png';
import { TbMessageChatbot } from "react-icons/tb";
import { FaUserDoctor } from "react-icons/fa6";
import { FaHospitalUser } from "react-icons/fa";
import { GrDocumentCloud } from "react-icons/gr";
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
        <img src={AdminDp} alt={username || 'Mobeen Chandler'} />
        <h2>{username || 'Admin'}</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/admin/doctors"
              className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}
            >
              <FaUserDoctor className="icon" /> Doctors
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/patients"
              className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}
            >
              <FaHospitalUser className="icon" /> Patients
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/appointments"
              className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}
            >
              <GrDocumentCloud className="icon" /> Appointments
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