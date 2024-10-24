import React, { useEffect, useState } from 'react';
import { fetchPatient, patientDelete, updatePatient } from '../api';
import { jwtDecode } from 'jwt-decode';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Helmet } from "react-helmet-async";
import { useNavigate } from 'react-router-dom';
import PatientSidebar from '../components/PatientSidebar';
import Swal from 'sweetalert2';
import './css/UpdatePage.css';

const PatientUpdatePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [patientData, setPatientData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        dob: '',
        password: '',
        email: '',
        city: '',
        gender: '',
        blood_group: '',
        emergency_contact: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const loadPatientData = async () => {
            try {
                if (!user || !user.token) {
                    throw new Error('User token not found');
                }
                const { user_id } = jwtDecode(user.token);
                const data = await fetchPatient(user_id);
                setPatientData({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    phone_number: data.phone_number,
                    dob: data.dob.split('T')[0],
                    email: data.email,
                    city: data.city,
                    gender: data.gender,
                    blood_group: data.blood_group,
                    emergency_contact: data.emergency_contact,
                    password: ''
                });
                setLoading(false);
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: `Failed to load patient data: ${error.message}`,
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
    
        loadPatientData();
    }, [user]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    
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
                }
            });
        }
    };


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedPatientData = {
                first_name: patientData.first_name,
                last_name: patientData.last_name,
                phone_number: patientData.phone_number,
                dob: patientData.dob,
                email: patientData.email,
                city: patientData.city,
                gender: patientData.gender,
                blood_group: patientData.blood_group,
                emergency_contact: patientData.emergency_contact,
                password: patientData.password || ""
            };
            if (!user || !user.token) {
                throw new Error('User token not found');
            }
            const { user_id } = jwtDecode(user.token);
            await updatePatient(user_id, updatedPatientData);
    
            Swal.fire({
                title: 'Update Successful',
                text: 'Patient details have been updated successfully.',
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
                    text: `Failed to update patient: ${error.message}`,
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
                await patientDelete(user_id, user.token);
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
                <title>Update Patient | AI HealthCare</title>
            </Helmet>
            <button 
                className="hamburger-menu"
                onClick={toggleSidebar}
                aria-label="Toggle menu"
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar with mobile responsiveness */}
            <div className={`sidebar-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <PatientSidebar />
            </div>
            <div className="update-content">
                <div className="update-header">
                    <h1 className="update-title">Update Patient</h1>
                    <button className="delete-button"  onClick={handleDelete}>Delete Profile</button>
                </div>

                <form onSubmit={handleSubmit} className="update-form">
                    <div className="form-group">
                        <label htmlFor="first_name">First Name</label>
                        <input
                            id="first_name"
                            type="text"
                            name="first_name"
                            value={patientData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="last_name">Last Name</label>
                        <input
                            id="last_name"
                            type="text"
                            name="last_name"
                            value={patientData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone_number">Phone Number</label>
                        <input
                            id="phone_number"
                            type="tel"
                            name="phone_number"
                            value={patientData.phone_number}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input
                            id="dob"
                            type="date"
                            name="dob"
                            value={patientData.dob}
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
                            value={patientData.email}
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
                            value={patientData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={patientData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="blood_group">Blood Group</label>
                        <select
                            id="blood_group"
                            name="blood_group"
                            value={patientData.blood_group}
                            onChange={handleChange}
                            required
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

                    <div className="form-group">
                        <label htmlFor="emergency_contact">Emergency Contact</label>
                        <input
                            id="emergency_contact"
                            type="tel"
                            name="emergency_contact"
                            value={patientData.emergency_contact}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password (Leave blank to keep unchanged)</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={patientData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="update-button">Update Patient</button>
                </form>
            </div>
        </div>

    );
};

export default PatientUpdatePage;