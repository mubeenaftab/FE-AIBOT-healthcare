import React, { useState } from 'react';
import './css/LoginPage.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { IoMdLogIn } from "react-icons/io";
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!username) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    if (!role) errors.role = 'Role is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await login(username, password, role);
      Swal.fire({
        title: 'Login Successful',
        text: 'Welcome back! You have successfully logged in.',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        background: '#1b1b1b',
        color: '#d8fffb',
        customClass: {
          title: 'swal2-title',
          popup: 'swal2-popup',
          timerProgressBar: 'green-progress-bar',
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });

      setTimeout(() => {
        if (role === 'patient') {
          navigate('/chat');
        } else if (role === 'admin') {
          navigate('/admin/doctors');
        } else if (role === 'doctor') {
          navigate('/doctor/appointments');
        }
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);

      let errorMessage = 'Login failed. Please try again.';

      if (error.response && error.response.data) {
        if (error.response.data.detail && typeof error.response.data.detail === 'object') {
          errorMessage = error.response.data.detail.detail;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        title: 'Login Failed',
        text: errorMessage,
        icon: 'error',
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        showConfirmButton: false,
        background: '#1b1b1b',
        color: '#d8fffb',
        customClass: {
          title: 'swal2-title',
          popup: 'swal2-popup',
          timerProgressBar: 'red-progress-bar',
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
    }
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center text-light">
      <Helmet>
        <title>Login | AI HealthCare</title>
      </Helmet>
      <div className="mb-3" style={{ fontSize: '2rem' }}>
        <IoMdLogIn style={{ color: '#15a083', fontWeight: 'bold' }} />
      </div>
      <h1 className="mb-5 heading">
        <span>AI</span>
        <span>HealthCare</span>
      </h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="mb-1 mt-3">
          <label htmlFor="username" className="form-label label" style={{ fontSize: '0.875rem' }}>Enter username</label>
          <input
            type="text"
            className={`form-control bg-dark text-light border-0 ${errors.username ? 'is-invalid' : ''}`}
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
            }}
          />
          {errors.username && <div className="invalid-feedback">{errors.username}</div>}
        </div>

        <div className="mb-1 mt-1">
          <label htmlFor="role" className="form-label label" style={{ fontSize: '0.875rem' }}>Select Role</label>
          <select
            className={`form-control bg-dark text-light border-0 ${errors.role ? 'is-invalid' : ''}`}
            id="role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
            }}
          >
            <option value="">Choose a role</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <div className="invalid-feedback">{errors.role}</div>}
        </div>

        <div className="mb-3 mt-1">
          <label htmlFor="password" className="form-label label" style={{ fontSize: '0.875rem' }}>Enter password</label>
          <input
            type="password"
            className={`form-control bg-dark text-light border-0 mb-4 ${errors.password ? 'is-invalid' : ''}`}
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
            }}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-1">
          Login
        </button>
      </form>
      <div className="mt-3 text-center">
        <p>Not registered yet?</p>
        <div className="d-flex justify-content-center">
          <Link to="/register/patient" className="btn btn-outline-light me-2">
            Register as Patient
          </Link>
          <Link to="/register/doctor" className="btn btn-outline-light">
            Register as Doctor
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
