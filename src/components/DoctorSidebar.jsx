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
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/${doctorId}`);
    
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications((prevNotifications) => [...prevNotifications, notification.message]);
      console.log("notification msg: ", notification.message);
      displayNotification(notification.message); // Display notification as a toast
    };

    ws.onclose = () => {
      setTimeout(() => setupWebSocket(doctorId), 3000); // Reconnect if closed
    };
  };

  const displayNotification = (message) => {
    Swal.fire({
      title: 'New Notification',
      text: message,
      icon: 'info',
      background: '#1b1b1b',
      color: '#d8fffb',
      position: 'top-end',
      timer: 20000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const handleProfileClick = () => {
    setShowEditButton(!showEditButton);
  };

  const handleEditProfile = () => {
    navigate('/doctors/update'); // Navigate to the patient update page
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to log out?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'Cancel',
      background: '#1b1b1b',
      color: '#d8fffb',
      showConfirmButton: true,
      allowOutsideClick: false,
      customClass: {
        popup: 'swal2-centered-popup',
      },
      position: 'center',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/login');
        Swal.fire({
          title: 'Logged Out',
          text: 'You have successfully logged out.',
          icon: 'success',
          background: '#1b1b1b',
          color: '#d8fffb',
          showConfirmButton: true,
          position: 'center',
          allowOutsideClick: false,
          customClass: {
            popup: 'swal2-centered-popup',
          },
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