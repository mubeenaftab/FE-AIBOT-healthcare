import React, { useState } from 'react';
import { createPrescription } from '../api';
import './css/PrescriptionForm.css';

const PrescriptionForm = ({ appointment, onClose }) => {
    const [medicationName, setMedicationName] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('');
    const [duration, setDuration] = useState('');
    const [instructions, setInstructions] = useState('');
    const [error, setError] = useState(null);

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
            // Clear the form after successful submission
            setMedicationName('');
            setDosage('');
            setFrequency('');
            setDuration('');
            setInstructions('');
            setError(null); // Clear error if any

            // The form remains open to create more prescriptions
        } catch (err) {
            setError('Failed to create prescription.'); // Handle error
            console.error(err);
        }
    };

    return (
        <div className="prescription-form-overlay">
            <div className="prescription-form-container">
                <h2>Create Prescription</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Medication Name:</label>
                        <input
                            type="text"
                            value={medicationName}
                            onChange={(e) => setMedicationName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Dosage:</label>
                        <input
                            type="text"
                            value={dosage}
                            onChange={(e) => setDosage(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Frequency:</label>
                        <input
                            type="text"
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Duration:</label>
                        <input
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Instructions:</label>
                        <textarea
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
