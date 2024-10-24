import { Helmet } from "react-helmet-async";
import React, { useEffect, useState } from 'react';
import { doctorDelete, fetchDoctor, updateDoctor } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import DoctorSidebar from '../components/DoctorSidebar';
import './css/UpdatePage.css';


const DoctorUpdatePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [doctorData, setDoctorData] = useState({
        password: '',
        firstName: '',
        lastName: '',
        specialization: '',
        phoneNumber: '',
        email: '',
        city: '',
        gender: '',
        yearsOfExperience: '',
        consultationFee: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const loadDoctorData = async () => {
            try {
                if (!user || !user.token) {
                    throw new Error('User token not found');
                }
                const { user_id } = jwtDecode(user.token);
                const data = await fetchDoctor(user_id);
                setDoctorData({
                    firstName: data.first_name,
                    lastName: data.last_name,
                    specialization: data.specialization,
                    phoneNumber: data.phone_number,
                    email: data.email,
                    city: data.city,
                    gender: data.gender,
                    yearsOfExperience: data.years_of_experience,
                    consultationFee: data.consultation_fee,
                    password: ''
                });
                setLoading(false);
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: `Failed to load doctor data: ${error.message}`,
                    icon: 'error',
                    toast: true,
                    timer: 3000,
                    timerProgressBar: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    background: '#1b1b1b',
                    color: '#d8fffb'
                });
                setLoading(false);
            }
        };
    
        loadDoctorData();
    }, [user]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctorData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    
    const showFirstError = (errors) => {
        console.log("msla", doctorData)
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
                }
            });
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedDoctorData = {
                first_name: doctorData.firstName,
                last_name: doctorData.lastName,
                specialization: doctorData.specialization,
                phone_number: doctorData.phoneNumber,
                email: doctorData.email,
                city: doctorData.city,
                gender: doctorData.gender,
                years_of_experience: doctorData.yearsOfExperience,
                consultation_fee: doctorData.consultationFee,
                password: doctorData.password || ""
            };
            if (!user || !user.token) {
                throw new Error('User token not found');
            }
            const { user_id } = jwtDecode(user.token);
            await updateDoctor(user_id, updatedDoctorData);
    
            Swal.fire({
                title: 'Update Successful',
                text: 'Doctor details have been updated successfully.',
                icon: 'success',
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                position: 'top-end',
                showConfirmButton: false,
                background: '#1b1b1b',
                color: '#d8fffb'
            });
    
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.detail;
                showFirstError(validationErrors);
            } else {
                Swal.fire({
                    title: 'Update Failed',
                    text: `Failed to update doctor: ${error.message}`,
                    icon: 'error',
                    toast: true,
                    timer: 3000,
                    timerProgressBar: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    background: '#1b1b1b',
                    color: '#d8fffb'
                });
            }
        }
    };

    const handleDelete = async () => {
        if (!user || !user.token) {
            Swal.fire({
                title: 'Error',
                text: 'User token not found',
                icon: 'error',
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                position: 'top-end',
                showConfirmButton: false,
                background: '#1b1b1b',
                color: '#d8fffb'
            });
            return;
        }
    
        const { user_id } = jwtDecode(user.token);
    
        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            background: '#1b1b1b',
            color: '#d8fffb'
        });
    
        if (confirmation.isConfirmed) {
            try {
                await doctorDelete(user_id, user.token);
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your profile has been deleted.',
                    icon: 'success',
                    toast: true,
                    timer: 3000,
                    timerProgressBar: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    background: '#1b1b1b',
                    color: '#d8fffb'
                });

                navigate('/login');

            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: `Failed to delete profile: ${error.message}`,
                    icon: 'error',
                    toast: true,
                    timer: 3000,
                    timerProgressBar: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    background: '#1b1b1b',
                    color: '#d8fffb'
                });
            }
        }
    };
    
    
    if (loading) return <div>Loading...</div>;
    
    return (
        <div className="update-container">
            <Helmet>
                <title>Update Doctor | AI HealthCare</title>
            </Helmet>
            <DoctorSidebar />
            <div className="update-content">
                <div className="update-header">
                    <h1 className="update-title">Update Doctor</h1>
                    <button className="delete-button" onClick={handleDelete}>Delete Profile</button>
                </div>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="update-form">

                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={doctorData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={doctorData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="specialization">Specialization</label>
                        <input
                            id="specialization"
                            type="text"
                            name="specialization"
                            value={doctorData.specialization}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                            id="phoneNumber"
                            type="tel"
                            name="phoneNumber"
                            value={doctorData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={doctorData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                            id="city"
                            type="text"
                            name="city"
                            value={doctorData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={doctorData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="others">Others</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="yearsOfExperience">Years of Experience</label>
                        <input
                            id="yearsOfExperience"
                            type="number"
                            name="yearsOfExperience"
                            value={doctorData.yearsOfExperience}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="consultationFee">Consultation Fee</label>
                        <input
                            id="consultationFee"
                            type="number"
                            name="consultationFee"
                            value={doctorData.consultationFee}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password (Leave blank to keep unchanged)</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={doctorData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="update-button">Update Doctor</button>
                </form>
            </div>
        </div>
    );
};

export default DoctorUpdatePage;
