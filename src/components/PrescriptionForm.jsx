import React, { useState } from 'react';
import { createPrescription } from '../api';
import './css/PrescriptionForm.css';
import Swal from 'sweetalert2';

const PrescriptionForm = ({ appointment, onClose }) => {
    const [medicationName, setMedicationName] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('');
    const [duration, setDuration] = useState('');
    const [instructions, setInstructions] = useState('');

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
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                },
                didClose: () => {
                    // Focus on the input field that has the error
                    const inputElement = document.getElementById(field);
                    if (inputElement) {
                        inputElement.focus();
                    }
                }
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const prescriptionData = {
            medication_name: medicationName,
            dosage,
            frequency,
            duration,
            instructions,
            patient_id: appointment.patient_id,
            doctor_id: appointment.doctor_id,
        };

        try {
            await createPrescription(prescriptionData);
            Swal.fire({
                title: 'Prescription Created',
                text: 'The prescription has been successfully created.',
                icon: 'success',
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                position: 'top-end',
                showConfirmButton: false,
                background: '#1b1b1b',
                color: '#d8fffb',
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });
            // Clear the form after successful submission
            setMedicationName('');
            setDosage('');
            setFrequency('');
            setDuration('');
            setInstructions('');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.detail;
                showFirstError(validationErrors);
            } else {
                Swal.fire({
                    title: 'Prescription Creation Failed',
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
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
            }
        }
    };

    return (
        <div className="prescription-form-overlay">
            <div className="prescription-form-container">
                <h2>Create Prescription</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="medication_name">Medication Name:</label>
                        <input
                            type="text"
                            id="medication_name"
                            value={medicationName}
                            onChange={(e) => setMedicationName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="dosage">Dosage:</label>
                        <input
                            type="text"
                            id="dosage"
                            value={dosage}
                            onChange={(e) => setDosage(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="frequency">Frequency:</label>
                        <input
                            type="text"
                            id="frequency"
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="duration">Duration:</label>
                        <input
                            type="text"
                            id="duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="instructions">Instructions:</label>
                        <textarea
                            id="instructions"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                        />
                    </div>

                    <div className="button-group">
                        <button type="submit">Submit</button>
                        <button
                            type="button"
                            className="close-button"
                            onClick={onClose}
                        >
                            Return
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrescriptionForm;