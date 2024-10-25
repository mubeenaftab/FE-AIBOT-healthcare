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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const navigate = useNavigate();

  const showFirstError = (errors) => {
    if (errors && errors.length > 0) {
      const firstError = errors[0];
      const field = firstError.loc[firstError.loc.length - 1];
      const message = firstError.msg;

      const toast = Swal.fire({
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
        },
      });
    }
  };

  // Handle the form submission
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

    const doctorData = {
      username,
      password,
      first_name: firstName,
      last_name: lastName,
      specialization,
      phone_number: phoneNumber,
      email,
      city,
      gender,
      years_of_experience: yearsOfExperience,
      consultation_fee: consultationFee,
    };

    try {
      await registerDoctor(doctorData);
      Swal.fire({
        title: 'Registration Successful',
        text: 'Doctor has been successfully registered.',
        icon: 'success',
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
      });
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const validationErrors = error.response.data.detail;

        if (status === 422) {
          const uniqueError = validationErrors.find(err => err.msg.toLowerCase().includes('unique'));

          if (uniqueError) {
            const field = uniqueError.loc[uniqueError.loc.length - 1];
            Swal.fire({
              title: `${field.charAt(0).toUpperCase() + field.slice(1)}`,
              text: 'This field must be unique.',
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
            });
            const inputElement = document.getElementById(field);
            if (inputElement) {
              inputElement.focus();
            }
          } else {
            showFirstError(validationErrors);
          }
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
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
        }
      }
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

        <div className="row g-3 mb-1 mt-3">
          <div className="col-md-4">
            <label htmlFor="username" className="form-label label" style={{ fontSize: '0.875rem' }}>Username</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-0"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="firstName" className="form-label label" style={{ fontSize: '0.875rem' }}>First Name</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-0"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="lastName" className="form-label label" style={{ fontSize: '0.875rem' }}>Last Name</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-0"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="row g-3 mb-1">
          <div className="col-md-6">
            <label htmlFor="specialization" className="form-label label" style={{ fontSize: '0.875rem' }}>Specialization</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-0"
              id="specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="phoneNumber" className="form-label label" style={{ fontSize: '0.875rem' }}>Phone Number</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-0"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="row g-3 mb-1">
          <div className="col-md-6">
            <label htmlFor="email" className="form-label label" style={{ fontSize: '0.875rem' }}>Email</label>
            <input
              type="email"
              className="form-control bg-dark text-light border-0"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="city" className="form-label label" style={{ fontSize: '0.875rem' }}>City</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-0"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        <div className="row g-3 mb-1">
          <div className="col-md-4">
            <label htmlFor="gender" className="form-label label" style={{ fontSize: '0.875rem' }}>Gender</label>
            <select
              className="form-control bg-dark text-light border-0"
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
          <div className="col-md-4">
            <label htmlFor="yearsOfExperience" className="form-label label" style={{ fontSize: '0.875rem' }}>Experience (Years)</label>
            <input
              type="number"
              className="form-control bg-dark text-light border-0"
              id="yearsOfExperience"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="consultationFee" className="form-label label" style={{ fontSize: '0.875rem' }}>Consultation Fee</label>
            <input
              type="number"
              className="form-control bg-dark text-light border-0"
              id="consultationFee"
              value={consultationFee}
              onChange={(e) => setConsultationFee(e.target.value)}
            />
          </div>
        </div>

        <div className="row g-3 mb-1">
          <div className="col-md-6">
            <label htmlFor="password" className="form-label label" style={{ fontSize: '0.875rem' }}>Password</label>
            <input
              type="password"
              className="form-control bg-dark text-light border-0"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="confirmPassword" className="form-label label" style={{ fontSize: '0.875rem' }}>Confirm Password</label>
            <input
              type="password"
              className="form-control bg-dark text-light border-0"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-3">
          Register Doctor
        </button>
      </form>
    </div>


  );
};

export default RegisterDoctorPage;
