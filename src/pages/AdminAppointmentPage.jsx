import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import './css/AdminAppointmentPage.css';
import { Helmet } from "react-helmet-async";
import { getAppointments, fetchDoctor, fetchPatient } from '../api';

const AdminAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(7);
    const [doctors, setDoctors] = useState({});
    const [patients, setPatients] = useState({});

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const params = {
                    page: currentPage,
                    size: pageSize,
                };
                const data = await getAppointments(params);
                setAppointments(data.items);
                setTotalPages(Math.ceil(data.total / pageSize));
                setLoading(false);

                // Fetch doctor and patient details
                const doctorPromises = data.items.map(appointment => 
                    fetchDoctor(appointment.doctor_id)
                );
                const patientPromises = data.items.map(appointment => 
                    fetchPatient(appointment.patient_id)
                );

                const doctorsData = await Promise.all(doctorPromises);
                const patientsData = await Promise.all(patientPromises);


                const doctorMap = {};
                doctorsData.forEach(doctor => {
                    doctorMap[doctor.user_id] = doctor;
                });
                setDoctors(doctorMap);

                const patientMap = {};
                patientsData.forEach(patient => {
                    patientMap[patient.user_id] = patient;
                });
                setPatients(patientMap);
                console.log("patients ", patients);
                console.log("doctors ", doctors);

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading appointments</p>;

    return (
        <div className="appointments-page-container">
            <Helmet>
                <title>Show Appointments | AI HealthCare</title>
            </Helmet>
            <AdminSidebar />
            <div className="appointments-content">
                <div className="appointments-header">
                    <h1 className="appointments-title">Appointments</h1>
                </div>
                <table className="appointments-table">
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Doctor Name</th>
                            <th>Appointment Date</th>
                            <th>Status</th>
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
                                <td>
                                    {doctors[appointment.doctor_id] 
                                        ? `${doctors[appointment.doctor_id].first_name} ${doctors[appointment.doctor_id].last_name}`
                                        : "Unknown Doctor"
                                    }
                                </td>
                                <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                                <td>{appointment.is_active ? 'Active' : 'Inactive'}</td>
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
            </div>
        </div>
    );
};

export default AdminAppointmentsPage;
