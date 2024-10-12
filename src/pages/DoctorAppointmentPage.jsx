import React, { useState, useEffect } from 'react';
import DoctorSidebar from '../components/DoctorSidebar';
import './css/DoctorAppointmentPage.css';
import { Helmet } from "react-helmet-async";
import { getDoctorAppointments, fetchPatient, fetchTimeslot, markAppointmentAsInactive } from '../api';
import PrescriptionForm from '../components/PrescriptionForm'; // Adjust API imports

function formatTime(timeString) {
    if (!timeString) return "N/A";

    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const DoctorAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(7);
    const [patients, setPatients] = useState({});
    const [timeslots, setTimeslots] = useState({});
    const [isPrescriptionFormOpen, setIsPrescriptionFormOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const params = {
                    page: currentPage,
                    size: pageSize,
                };
                const data = await getDoctorAppointments(params);
                if (data.items.length === 0) {
                    setAppointments([]);
                } else {
                    setAppointments(data.items);
                    setTotalPages(Math.ceil(data.total / pageSize));

                    const patientPromises = data.items.map(appointment =>
                        fetchPatient(appointment.patient_id)
                    );
                    const patientsData = await Promise.all(patientPromises);

                    const patientMap = {};
                    patientsData.forEach(patient => {
                        patientMap[patient.user_id] = patient;
                    });
                    setPatients(patientMap);

                    const timeslotPromises = data.items.map(appointment =>
                        fetchTimeslot(appointment.doctor_id)
                    );
                    const timeslotData = await Promise.all(timeslotPromises);
                    const timeslotMap = {};
                    timeslotData.forEach(timeslot => {
                        timeslotMap[timeslot.doctor_id] = timeslot;
                    });
                    setTimeslots(timeslotMap);


                }
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [currentPage, pageSize]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (event) => {
        const newSize = Number(event.target.value);
        setPageSize(newSize);
        setCurrentPage(1);
    };

    const handleMarkAsDone = async (appointment) => {
        try {
            await markAppointmentAsInactive(appointment.appointment_id); // Call API to mark as inactive
            setAppointments((prevAppointments) =>
                prevAppointments.map(a =>
                    a.appointment_id === appointment.appointment_id
                        ? { ...a, is_active: false } // Update the appointment state
                        : a
                )
            );
            setSelectedAppointment(appointment); // Set the selected appointment for the form
            setIsPrescriptionFormOpen(true); // Open the prescription form
        } catch (err) {
            console.error("Failed to mark appointment as done:", err);
        }
    };
    const closePrescriptionForm = () => {
        setIsPrescriptionFormOpen(false);
        setSelectedAppointment(null);
    };



    return (
        <div className="doctor-page-container">
            <Helmet>
                <title>Doctor's Appointments | AI HealthCare</title>
            </Helmet>
            <DoctorSidebar />
            <div className="appointments-content">
                <div className="appointments-header">
                    <h1 className="appointments-title">My Appointments</h1>
                </div>

                {appointments.length === 0 ? (
                    <div className="no-appointments-container">
                        <p className="no-appointments-message">No appointments available</p>
                    </div>
                ) : (
                    <>
                        <table className="appointments-table">
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Appointment Date</th>
                                    <th>Start time</th>
                                    <th>End time</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appointment) => (
                                    <tr key={appointment.appointment_id}>
                                        <td>
                                            {patients[appointment.patient_id]
                                                ? `${patients[appointment.patient_id].first_name} ${patients[appointment.patient_id].last_name}`
                                                : "Unknown Patient"
                                            }
                                        </td>
                                        <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                                        <td>
                                            {timeslots[appointment.doctor_id]?.start_time
                                                ? formatTime(timeslots[appointment.doctor_id].start_time)
                                                : "N/A"
                                            }
                                        </td>
                                        <td>
                                            {timeslots[appointment.doctor_id]?.end_time
                                                ? formatTime(timeslots[appointment.doctor_id].end_time)
                                                : "N/A"
                                            }
                                        </td>
                                        <td>{appointment.is_active ? 'Active' : 'Inactive'}</td>
                                        <td>
                                            {appointment.is_active ? (
                                                <button
                                                    onClick={() => handleMarkAsDone(appointment)} // Pass appointment to the handler
                                                    className="mark-done-button"
                                                >
                                                    Mark as Done
                                                </button>
                                            ) : (
                                                <button disabled className="done-button">
                                                    Done
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="pagination-controls">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                            <select
                                value={pageSize}
                                onChange={handlePageSizeChange}
                            >
                                <option value="7">7 per page</option>
                                <option value="14">14 per page</option>
                                <option value="21">21 per page</option>
                            </select>
                        </div>
                    </>
                )}

                {isPrescriptionFormOpen && (
                    <PrescriptionForm
                        appointment={selectedAppointment}
                        onClose={closePrescriptionForm}
                    />
                )}
            </div>
        </div>
    );
};

export default DoctorAppointmentsPage;