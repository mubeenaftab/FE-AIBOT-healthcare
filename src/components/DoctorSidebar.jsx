import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import DoctorDp from '../assets/doctor.png';
import { FaHome, FaRegCreditCard, FaHistory } from 'react-icons/fa';

import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import './css/Sidebar.css';
import Swal from 'sweetalert2';

function Sidebar() {
  const [username, setUsername] = useState('');
  const [showEditButton, setShowEditButton] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.sub && decodedToken.user_id) {
          setUsername(decodedToken.sub);
          setupWebSocket(decodedToken.user_id);
        } else {
          console.error('Required fields not found in decoded token');
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      console.error('No token found in localStorage');
    }
  }, []);

  const setupWebSocket = (doctorId) => {
    const ws = new WebSocket(`wss://be-aibot-healthcare.onrender.com/ws/notifications/${doctorId}`);
    
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications((prevNotifications) => [...prevNotifications, notification.message]);
      console.log("notification msg: ", notification.message);
      displayNotification(notification.message);
    };

    ws.onclose = () => {
      setTimeout(() => setupWebSocket(doctorId), 3000);
    };
  };

  const displayNotification = (message) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    Toast.fire({
      icon: 'info',
      title: message,
      background: '#1b1b1b',
      color: '#d8fffb',
      iconColor: '#00bfa5',
      customClass: {
        popup: 'notification-toast',
        title: 'notification-title',
      }
    });
  };


  const handleProfileClick = () => {
    setShowEditButton(!showEditButton);
  };

  const handleEditProfile = () => {
    navigate('/doctors/update'); // Navigate to the patient update page
  };

  const handleLogout = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#00bfa5',
      cancelButtonColor: '#ff5252',
      timer: false,
      customClass: {
        popup: 'notification-toast',
        title: 'notification-title',
      }
    });

    Toast.fire({
      title: 'Do you want to logout?',
      background: '#1b1b1b',
      color: '#d8fffb',
      icon: 'question',
      iconColor: '#00bfa5',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/login');
        
        // Show logout success notification
        Toast.fire({
          icon: 'success',
          title: 'Successfully logged out',
          showConfirmButton: false,
          timer: 3000,
        });
      }
    });
  };

  return (
    <aside className="sidebar">
      <div className="profile" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
        <img src={DoctorDp} alt={username || 'Mobeen Chandler'} />
        <h2>{username || 'Admin'}</h2>
        {showEditButton && (
          <div className="profile-buttons">
            <button className="edit-profile-btn" onClick={handleEditProfile}>
              Edit Profile
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/doctor/appointments"
              className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}
            >
              <FaHome className="icon" /> Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/timeslot-form"
              className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}
            >
              <FaRegCreditCard className="icon" /> Add Timeslots
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/doctors/appointment/history"
              className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}
            >
              <FaHistory className="icon" /> View History
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;