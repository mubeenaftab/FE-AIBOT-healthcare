import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import './css/AdminPatientPage.css';
import Swal from 'sweetalert2';
import { Helmet } from "react-helmet-async";
import { FaFilter } from "react-icons/fa";
import { getPatients, deletePatient } from '../api';

const AdminPatientPage = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterVisible, setFilterVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(7);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const params = {
                    page: currentPage,
                    size: pageSize,
                    search: searchTerm,
                };
                const data = await getPatients(params);
                setPatients(data.items);
                setTotalPages(Math.ceil(data.total / pageSize));
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchPatients();
    }, [searchTerm, currentPage, pageSize]);

    const handleDelete = async (patientId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this patient? This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                const status = await deletePatient(patientId);
                if (status === 204) {
                    Swal.fire(
                        'Deleted!',
                        'The patient has been successfully deleted.',
                        'success'
                    );
                    // Update state to remove deleted patient
                    setPatients(patients.filter(patient => patient.user_id !== patientId));
                }
            } catch (error) {
                Swal.fire(
                    'Error!',
                    `An error occurred: ${error.message}`,
                    'error'
                );
                console.error(error);
            }
        } else {
            Swal.fire(
                'Cancelled',
                'The patient was not deleted.',
                'info'
            );
        }
    };

    const handleFilterToggle = () => {
        setFilterVisible(prevVisible => !prevVisible);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (event) => {
        const newSize = Number(event.target.value);
        setPageSize(newSize);
        setCurrentPage(1);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading patients</p>;

    return (
        <div className="patients-page-container">
            <Helmet>
                <title>Show Patients | AI HealthCare</title>
            </Helmet>
            <AdminSidebar />
            <div className="patients-content">
                <div className="patients-header">
                    <h1 className="patients-title">Patients</h1>
                    <div className="header-buttons">
                        <div className="grouped-buttons">
                            <div className="extra-buttons">
                                <button className="filter-btn" onClick={handleFilterToggle}>
                                    <FaFilter className='icon' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {filterVisible && (
                    <div className="search-bar-container">
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
                <table className="patients-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone</th>
                            <th>DOB</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.user_id}>
                                <td className='first-td'>{patient.username}</td>
                                <td>{patient.first_name}</td>
                                <td>{patient.last_name}</td>
                                <td>{patient.phone_number}</td>
                                <td>{new Date(patient.dob).toLocaleDateString()}</td>
                                <td className='last-td'>
                                    <button 
                                        className="btn custom-delete-btn" 
                                        onClick={() => handleDelete(patient.user_id)}>
                                        Delete
                                    </button>
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
            </div>
        </div>
    );
};

export default AdminPatientPage;
