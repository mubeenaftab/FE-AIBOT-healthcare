import React, { useState } from 'react';
import './css/SignupPatient.css';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { registerDoctor } from '../api';
import Swal from 'sweetalert2';

const RegisterDoctorPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one digit';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber.startsWith('03') || phoneNumber.length !== 11 || !/^\d+$/.test(phoneNumber)) {
      return 'Phone number must be a valid Pakistani number starting with "03" and exactly 11 digits long';
    }
    return '';
  };

  const validateForm = () => {
    const errors = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3 || username.length > 80) {
        errors.username = 'Username must be greater than 3';
    }
      if (!firstName.trim() || firstName.length < 2 || firstName.length > 50) {
      errors.firstName = 'First name must be greater than 2';
    }
    if (!lastName.trim() || lastName.length < 2 || lastName.length > 50) {
      errors.lastName = 'Last name must be greater than 2';
    }
    if (!specialization.trim() || specialization.length < 3 || specialization.length > 100) {
      errors.specialization = 'Specialization must be between 3';
    }

    const phoneNumberError = validatePhoneNumber(phoneNumber);
    if (phoneNumberError) errors.phoneNumber = phoneNumberError;

    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please correct the highlighted fields.',
        icon: 'error',
        toast: true,
        timer: 5000,
        position: 'top-end',
        background: '#1b1b1b',
        color: '#d8fffb',
        showConfirmButton: false,
      });
      return;
    }

    const doctorData = {
      username,
      password,
      first_name: firstName,
      last_name: lastName,
      specialization,
      phone_number: phoneNumber,
    };

    try {
      await registerDoctor(doctorData);
      Swal.fire({
        title: 'Doctor Registered!',
        text: 'Doctor registration was successful.',
        icon: 'success',
        timer: 3000,
        toast: true,
        position: 'top-end',
        background: '#1b1b1b',
        color: '#d8fffb',
        showConfirmButton: false,
      });

      navigate('/login');
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Registration failed. Please try again.',
        icon: 'error',
        toast: true,
        timer: 5000,
        position: 'top-end',
        background: '#1b1b1b',
        color: '#d8fffb',
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center text-light">
      <Helmet>
        <title>Register Doctor | AI HealthCare</title>
      </Helmet>
      <h1 className="mb-5 heading">
        <span>AI</span>
        <span>HealthCare</span>
      </h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="mb-1 mt-3">
          <label htmlFor="username" className="form-label label">Username</label>
          <input
            type="text"
            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <div className="invalid-feedback">{errors.username}</div>}
        </div>

        <div className="mb-1">
          <label htmlFor="firstName" className="form-label label">First Name</label>
          <input
            type="text"
            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
        </div>

        <div className="mb-1">
          <label htmlFor="lastName" className="form-label label">Last Name</label>
          <input
            type="text"
            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
        </div>

        <div className="mb-1">
          <label htmlFor="specialization" className="form-label label">Specialization</label>
          <input
            type="text"
            className={`form-control ${errors.specialization ? 'is-invalid' : ''}`}
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
          {errors.specialization && <div className="invalid-feedback">{errors.specialization}</div>}
        </div>

        <div className="mb-1">
          <label htmlFor="phoneNumber" className="form-label label">Phone Number</label>
          <input
            type="text"
            className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
        </div>

        <div className="mb-1">
          <label htmlFor="password" className="form-label label">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-1">Register Doctor</button>
      </form>
    </div>
  );
};

export default RegisterDoctorPage;
