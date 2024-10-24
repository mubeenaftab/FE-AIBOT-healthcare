import React from 'react';
import './css/PatientInfo.css';

const PatientInfo = ({ patient, onClose }) => {
    if (!patient) {
        return null;
    }

    // Format date of birth to a readable format
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div className="patient-info-overlay">
            <div className="patient-info-container">
                <h2>Patient Information</h2>
                <button
                    type="button"
                    className="close-button-top-right"
                    onClick={onClose}
                >
                    &times;
                </button>

                <div className="patient-info-content">
                    <div className="info-group">
                        <div className="info-item">
                            <label>Full Name:</label>
                            <span>{`${patient.first_name} ${patient.last_name}`}</span>
                        </div>

                        <div className="info-item">
                            <label>Email:</label>
                            <span>{patient.email || "N/A"}</span>
                        </div>

                        <div className="info-item">
                            <label>Phone Number:</label>
                            <span>{patient.phone_number || "N/A"}</span>
                        </div>

                        <div className="info-item">
                            <label>Date of Birth:</label>
                            <span>{formatDate(patient.dob)}</span>
                        </div>

                        <div className="info-item">
                            <label>Gender:</label>
                            <span>{patient.gender || "N/A"}</span>
                        </div>

                        <div className="info-item">
                            <label>Blood Group:</label>
                            <span>{patient.blood_group || "N/A"}</span>
                        </div>

                        <div className="info-item">
                            <label>Emergency Contact:</label>
                            <span>{patient.emergency_contact || "N/A"}</span>
                        </div>

                        <div className="info-item">
                            <label>City:</label>
                            <span>{patient.city || "N/A"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientInfo;