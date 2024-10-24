import React, { useState, useEffect } from 'react';
import DoctorSidebar from '../components/DoctorSidebar';
import './css/DoctorAppointmentPage.css';
import { Helmet } from "react-helmet-async";
import { FaFilter } from "react-icons/fa";
import { CgSortAz } from "react-icons/cg";
import { getDoctorInactiveAppointments, fetchPatient, fetchTimeslot, markAppointmentAsInactive } from '../api';
import PatientInfo from '../components/PatientInfo';

function formatTime(timeString) {
    if (!timeString) return "N/A";

    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const DoctorAppointmentHostory = () => {
    const [appointments, setAppointments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(7);
    const [patients, setPatients] = useState({});
    const [timeslots, setTimeslots] = useState({});
    const [filterVisible, setFilterVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isPatientInfoOpen, setIsPatientInfoOpen] = useState(false);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const params = {
                    page: currentPage,
                    size: pageSize,
                    search: searchTerm,
                    sort_order: sortOrder
                };
                const data = await getDoctorInactiveAppointments(params);
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
                        fetchTimeslot(appointment.doctor_id, appointment.patient_id)
                    );
                    const timeslotData = await Promise.all(timeslotPromises);
                    const timeslotMap = {};
                    timeslotData.forEach(timeslot => {
                        timeslotMap[`${timeslot.doctor_id}-${timeslot.patient_id}`] = timeslot;
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
    }, [searchTerm, sortOrder, currentPage, pageSize]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSortToggle = () => {
        setSortOrder(prevOrder => prevOrder === 'desc' ? 'asc' : 'desc');
    };

    const handleFilterToggle = () => {
        setFilterVisible(prevVisible => !prevVisible);
    };

    const handlePageSizeChange = (event) => {
        const newSize = Number(event.target.value);
        setPageSize(newSize);
        setCurrentPage(1);
    };

    const handleMarkAsDone = async (appointment) => {
        try {
            await markAppointmentAsInactive(appointment.appointment_id);
            setAppointments((prevAppointments) =>
                prevAppointments.map(a =>
                    a.appointment_id === appointment.appointment_id
                        ? { ...a, is_active: false }
                        : a
                )
            );
            setSelectedAppointment(appointment);
            setIsPrescriptionFormOpen(true);
        } catch (err) {
            console.error("Failed to mark appointment as done:", err);
        }
    };

    const handleViewPatient = (patientId) => {
        setSelectedAppointment(appointments.find(a => a.patient_id === patientId));
        setIsPatientInfoOpen(true);
    };


    const closePatientInfo = () => {
        setIsPatientInfoOpen(false);
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
                    <h1 className="appointments-title">Appointments History</h1>
                    <div className="header-buttons">
                        <div className="grouped-buttons">
                            <div className="extra-buttons">
                                <button className="filter-btn" onClick={handleFilterToggle}>
                                    <FaFilter className='icon' />
                                </button>
                                <button className="options-btn" onClick={handleSortToggle}>
                                    <CgSortAz className='icon' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {appointments.length === 0 ? (
                    <div className="no-appointments-container">
                        <p className="no-appointments-message">No appointments available</p>
                    </div>
                ) : (
                    <>
                        {filterVisible && (
                            <div className="search-bar-container">
                                <input
                                    type="text"
                                    className="search-bar"
                                    placeholder="Search expenses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        )}
                        <table className="appointments-table">
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Appointment Date</th>
                                    <th>Start time</th>
                                    <th>End time</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                    <th>Patient Info</th>
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
                                            {timeslots[`${appointment.doctor_id}-${appointment.patient_id}`]?.start_time
                                                ? formatTime(timeslots[`${appointment.doctor_id}-${appointment.patient_id}`].start_time)
                                                : "N/A"
                                            }
                                        </td>
                                        <td>
                                            {timeslots[`${appointment.doctor_id}-${appointment.patient_id}`]?.end_time
                                                ? formatTime(timeslots[`${appointment.doctor_id}-${appointment.patient_id}`].end_time)
                                                : "N/A"
                                            }
                                        </td>
                                        <td>{appointment.is_active ? 'Active' : 'Inactive'}</td>
                                        <td>
                                            {appointment.is_active ? (
                                                <>
                                                    <button
                                                        onClick={() => handleMarkAsDone(appointment)}
                                                        className="mark-done-button"
                                                    >
                                                        Mark as Done
                                                    </button>

                                                </>
                                            ) : (
                                                <button disabled className="done-button">
                                                    Done
                                                </button>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleViewPatient(appointment.patient_id)} // New view patient button
                                                className="mark-done-button"
                                            >
                                                View Patient
                                            </button>
                                        </td>
                                        <td>

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


                {isPatientInfoOpen && selectedAppointment && (
                    <PatientInfo
                        patient={patients[selectedAppointment.patient_id]}
                        onClose={closePatientInfo}
                    />
                )}
            </div>
        </div>
    );
};

export default DoctorAppointmentHostory;
