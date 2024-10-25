import React, { useState } from 'react';
import './css/SignupPatient.css';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { registerPatient } from '../api';
import Swal from 'sweetalert2';

const RegisterPatientPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const navigate = useNavigate();

  const showFirstError = (errors) => {
    if (errors && errors.length > 0) {
      const firstError = errors[0];
      const field = firstError.loc[firstError.loc.length - 1];
      const message = firstError.msg;

      Swal.fire({
        title: `${field.charAt(0).toUpperCase() + field.slice(1)}`,
        text: message,
        icon: 'error',
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        showConfirmButton: false,
        background: '#1b1b1b',
        color: '#d8fffb',
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
        didClose: () => {
          const inputElement = document.getElementById(field);
          if (inputElement) {
            inputElement.focus();
          }
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Password Mismatch',
        text: 'Passwords do not match. Please try again.',
        icon: 'error',
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        showConfirmButton: false,
        background: '#1b1b1b',
        color: '#d8fffb',
      });
      return;
    }

    const patientData = {
      username,
      password,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      dob,
      email,
      city,
      gender,
      blood_group: bloodGroup,
      emergency_contact: emergencyContact,
    };

    try {
      await registerPatient(patientData);
      Swal.fire({
        title: 'Registration Successful',
        text: 'Patient has been successfully registered.',
        icon: 'success',
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        showConfirmButton: false,
        background: '#1b1b1b',
        color: '#d8fffb',
      });
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.detail;
        showFirstError(validationErrors);
      } else {
        Swal.fire({
          title: 'Registration Failed',
          text: 'Something went wrong. Please try again.',
          icon: 'error',
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          showConfirmButton: false,
          background: '#1b1b1b',
          color: '#d8fffb',
        });
      }
    }
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center text-light">
      <Helmet>
        <title>Register Patient | AI HealthCare</title>
      </Helmet>
      <h1 className="mb-4 heading">
        <span>AI</span>
        <span>HealthCare</span>
      </h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="row mb-2">
          <div className="col-md-6 mb-2">
            <label htmlFor="username" className="form-label label">Enter Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-2">
            <label htmlFor="phoneNumber" className="form-label label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-md-6 mb-2">
            <label htmlFor="firstName" className="form-label label">First Name</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-2">
            <label htmlFor="lastName" className="form-label label">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-md-6 mb-2">
            <label htmlFor="dob" className="form-label label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-2">
            <label htmlFor="email" className="form-label label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-md-6 mb-2">
            <label htmlFor="city" className="form-label label">City</label>
            <input
              type="text"
              className="form-control"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-2">
            <label htmlFor="gender" className="form-label label">Gender</label>
            <select
              className="form-control"
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-md-6 mb-2">
            <label htmlFor="bloodGroup" className="form-label label">Blood Group</label>
            <select
              className="form-control"
              id="bloodGroup"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
            >
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
          <div className="col-md-6 mb-2">
            <label htmlFor="emergencyContact" className="form-label label">Emergency Contact</label>
            <input
              type="text"
              className="form-control"
              id="emergencyContact"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6 mb-2">
            <label htmlFor="password" className="form-label label">Enter Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-2">
            <label htmlFor="confirmPassword" className="form-label label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-3">Register Patient</button>
      </form>
    </div>



  );
}

export default RegisterPatientPage;