import React, { useState } from 'react';
import './css/SignupPatient.css';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { registerPatient } from '../api';
import Swal from 'sweetalert2';

const RegisterPatientPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const validateForm = () => {
    if (!username) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    if (!firstName) errors.firstName = 'First name is required';
    if (!lastName) errors.lastName = 'Last name is required';
    if (!phoneNumber) errors.phoneNumber = 'Phone number is required';
    if (!dob) errors.dob = 'Date of birth is required';

    const errors = {};
  
    // Username validation: required and length between 3 and 80 characters
    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3 || username.length > 80) {
      errors.username = 'Username must be greater than 3';
    }
  
    // Password validation: required and can add complexity checks if needed
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
  
    if (!firstName.trim() || firstName.length < 2 || firstName.length > 50) {
      errors.firstName = 'First name must be greater than 2';
    }
    if (!lastName.trim() || lastName.length < 2 || lastName.length > 50) {
      errors.lastName = 'Last name must be greater than 2';
    }
  
    // Phone Number validation: required (can add more validation if format is specific)
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{11}$/.test(phoneNumber)) {
      errors.phoneNumber = 'Phone number must be 11 digits long';
    }
  
    // Date of Birth validation: required
    if (!dob) {
      errors.dob = 'Date of birth is required';
    }
  
    return errors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const patientData = {
      username,
      password,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      dob,
    };
  
    try {
      await registerPatient(patientData);
      Swal.fire({
        title: 'Registration Successful',
        text: 'Patient has been successfully registered.',
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
      });
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.error('Registration failed:', error);
  
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response && error.response.data) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map(err => err.msg).join(', ') || errorMessage;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
      }
  
      Swal.fire({
        title: 'Registration Failed',
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
      });
    }
  };
  
  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center text-light">
      <Helmet>
        <title>Register Patient | AI HealthCare</title>
      </Helmet>
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
          <label htmlFor="firstName" className="form-label label" style={{ fontSize: '0.875rem' }}>First Name</label>
          <input
            type="text"
            className={`form-control bg-dark text-light border-0 ${errors.firstName ? 'is-invalid' : ''}`}
            id="firstName"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, firstName: '' }));
            }}
          />
          {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
        </div>

        <div className="mb-1 mt-1">
          <label htmlFor="lastName" className="form-label label" style={{ fontSize: '0.875rem' }}>Last Name</label>
          <input
            type="text"
            className={`form-control bg-dark text-light border-0 ${errors.lastName ? 'is-invalid' : ''}`}
            id="lastName"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, lastName: '' }));
            }}
          />
          {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
        </div>

        <div className="mb-1 mt-1">
          <label htmlFor="phoneNumber" className="form-label label" style={{ fontSize: '0.875rem' }}>Phone Number</label>
          <input
            type="text"
            className={`form-control bg-dark text-light border-0 ${errors.phoneNumber ? 'is-invalid' : ''}`}
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: '' }));
            }}
          />
          {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
        </div>

        <div className="mb-1 mt-1">
          <label htmlFor="dob" className="form-label label" style={{ fontSize: '0.875rem' }}>Date of Birth</label>
          <input
            type="date"
            className={`form-control bg-dark text-light border-0 ${errors.dob ? 'is-invalid' : ''}`}
            id="dob"
            value={dob}
            onChange={(e) => {
              setDob(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, dob: '' }));
            }}
          />
          {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
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
          Register Patient
        </button>
      </form>
    </div>
  );
}

export default RegisterPatientPage;
