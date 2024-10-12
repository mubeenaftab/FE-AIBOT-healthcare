import React, { useState } from 'react';
import DoctorSidebar from '../components/DoctorSidebar';
import './css/TimeSlotPage.css';
import { Helmet } from "react-helmet-async";
import { registerTimeSlot } from '../api'; // Adjust API imports

const TimeSlotPage = () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Ensure times are in "HH:MM:SS" format
            const startDateTime = `${startTime}:00`; // Append ":00" for seconds
            const endDateTime = `${endTime}:00`;     // Append ":00" for seconds

            const timeslotData = {
                start_time: startDateTime,
                end_time: endDateTime,
                status: 'available',
            };

            await registerTimeSlot(timeslotData);
            setSuccess(true);
            setStartTime('');
            setEndTime('');
        } catch (err) {
            setError("Failed to create timeslot. Please try again.");
            console.error("Error creating timeslot:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-timeslot-container">
            <Helmet>
                <title>Create Timeslot | AI HealthCare</title>
            </Helmet>
            <DoctorSidebar />
            <div className="timeslot-content">
                <h1 className="timeslot-title">Create Timeslot</h1>

                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">Timeslot created successfully!</p>}

                <form onSubmit={handleSubmit} className="timeslot-form">
                    <label htmlFor="start-time">Start Time:</label>
                    <input
                        type="time"
                        id="start-time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />

                    <label htmlFor="end-time">End Time:</label>
                    <input
                        type="time"
                        id="end-time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />

                    <button type="submit" className="create-timeslot-button">Create Timeslot</button>
                </form>
            </div>
        </div>
    );
};

export default TimeSlotPage;
