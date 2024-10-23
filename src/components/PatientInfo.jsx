import React, { useState } from 'react';
// import { createPrescription } from '../api';
import './css/PatientInfo.css';


const PatientInfo = ({ onClose }) => {


    return (
        <div className="patient-info-overlay">
            <div className="patient-info-container">
                <h2>Patient Info</h2>
                <button
                    type="button"
                    className="close-button-top-right"
                    onClick={onClose}
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default PatientInfo;