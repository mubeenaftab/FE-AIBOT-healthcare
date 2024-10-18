import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPatientPage from './pages/SignupPatient'
import RegisterDoctorPage from './pages/SignupDoctor'
import AdminPatientPage from './pages/AdminPatientPage';
import AdminAppointmentsPage from './pages/AdminAppointmentPage';
import ChatPage from './pages/ChatPage';
import AdminDoctorPage from './pages/AdminDoctorPage';
import DoctorAppointmentsPage from './pages/DoctorAppointmentPage';
import PatientUpdatePage from './pages/PatientUpdatePage';
import DoctorUpdatePage from './pages/DoctorUpdatePage';
import TimeSlotPage from './pages/TimeSlotPage';
import useIdleTimeout from './hooks/useIdleTimeout';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? (
        <Component {...rest} />
    ) : (
        <Navigate to="/login" />
    );
};

const AppRoutes = () => {
    useIdleTimeout();

    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register/patient" element={<RegisterPatientPage />} />
            <Route path="/register/doctor" element={<RegisterDoctorPage />} />

            <Route path="/chat" element={<PrivateRoute element={ChatPage} />} />
            <Route path="/admin/doctors" element={<PrivateRoute element={AdminDoctorPage} />} />
            <Route path="/admin/patients" element={<PrivateRoute element={AdminPatientPage} />} />
            <Route path="/admin/appointments" element={<PrivateRoute element={AdminAppointmentsPage} />} />
            <Route path="/doctor/appointments" element={<PrivateRoute element={DoctorAppointmentsPage} />} />
            <Route path="/timeslot-form" element={<PrivateRoute element={TimeSlotPage} />} />
            <Route path="/patients/update" element={<PrivateRoute element={PatientUpdatePage} />} />
            <Route path="/doctors/update" element={<PrivateRoute element={DoctorUpdatePage} />} />
        </Routes>
    );
};

export default AppRoutes;