import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import DoctorSidebar from '../components/DoctorSidebar';
import './css/UpdatePage.css'; // Use the same CSS file
import { Helmet } from "react-helmet-async";
import { fetchDoctor, updateDoctor } from '../api'; // Make sure to create this function in your API file
import { useAuth } from '../context/AuthContext';

const DoctorUpdatePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [doctorData, setDoctorData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        specialization: '',
        password: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const loadDoctorData = async () => {
            try {
                if (!user || !user.token) {
                    throw new Error('User token not found');
                }
                const { user_id } = jwtDecode(user.token);
                const data = await fetchDoctor(user_id);
                setDoctorData({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    phone_number: data.phone_number,
                    specialization: data.specialization,
                    password: ''
                });
                setLoading(false);
            } catch (error) {
                setError('Failed to load doctor data: ' + error.message);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        try {
            if (!user || !user.token) {
                throw new Error('User token not found');
            }
            const { user_id } = jwtDecode(user.token); // Assuming user_id is the doctor's ID
            await updateDoctor(user_id, doctorData); // Ensure this API is correctly set up
            setSuccess(true);
        } catch (error) {
            setError('Failed to update doctor: ' + error.message);
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
                <h1 className="update-title">Update Doctor</h1>

                {success && <p className="success-message">Doctor updated successfully!</p>}
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="update-form">
                    <div className="form-group">
                        <label htmlFor="first_name">First Name</label>
                        <input
                            id="first_name"
                            type="text"
                            name="first_name"
                            value={doctorData.first_name}
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
                            value={doctorData.last_name}
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
                            value={doctorData.phone_number}
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
