import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import PatientSidebar from '../components/PatientSidebar';
import './css/UpdatePage.css';
import { Helmet } from "react-helmet-async";
import { fetchPatient, updatePatient } from '../api';
import { useAuth } from '../context/AuthContext';

const PatientUpdatePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [patientData, setPatientData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        dob: '',
        password: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

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
                    password: ''
                });
                setLoading(false);
            } catch (error) {
                setError('Failed to load patient data: ' + error.message);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        try {
            if (!user || !user.token) {
                throw new Error('User token not found');
            }
            const { user_id } = jwtDecode(user.token);
            await updatePatient(user_id, patientData);
            setSuccess(true);
        } catch (error) {
            setError('Failed to update patient: ' + error.message);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="update-container">
            <Helmet>
                <title>Update Patient | AI HealthCare</title>
            </Helmet>
            <PatientSidebar />
            <div className="update-content">
                <h1 className="update-title">Update Patient</h1>

                {success && <p className="success-message">Patient updated successfully!</p>}
                {error && <p className="error-message">{error}</p>}
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