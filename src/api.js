import axios from 'axios';
const api = axios.create({
  baseURL: 'https://be-aibot-healthcare.onrender.com',


});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const registerPatient = async (patientData) => {
  const response = await api.post(`/register/patient`, patientData);
  return response.data;
};

export const updatePatient = async (patientId, patientData) => {
  const response = await api.put(`/update/patient/${patientId}`, patientData);
  return response.data;
}

export const updateDoctor = async (doctorId, doctorData) => {
  const response = await api.put(`/update/doctor/${doctorId}`, doctorData);
  return response.data;
};



export const registerDoctor = async (doctorData) => {
  const response = await api.post(`/register/doctor`, doctorData);
  return response.data;
};
export const registerTimeSlot = async (timeslotData) => {
  try {
    const response = await api.post(`/create/timeslot`, timeslotData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || 'An error occurred while creating the timeslot.');
    } else if (error.request) {
      throw new Error('No response from the server. Please try again later.');
    } else {
      throw new Error('An unexpected error occurred: ' + error.message);
    }
  }
};

export const createPrescription = async (prescriptionData) => {

  const response = await api.post(`/prescriptions`, prescriptionData);
  return response.data;

};


export const sendChatMessage = async (message) => {
  try {
    const response = await api.post(`/chat`, {
      user_message: message
    });
    return response.data.response;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

export const fetchReminders = async () => {
  try {
    const response = await api.get('/chat/reminders');

    if (response.data && response.data.reminders) {
      return response.data.reminders;
    } else {
      throw new Error('No reminders found in the response');
    }
  } catch (error) {
    console.error('Error fetching reminders:', error);
    throw error;
  }
};

export const getDoctors = async (params) => {
  try {
    const response = await api.get('/admin/doctors', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const deleteDoctor = async (doctorId) => {
  try {
    const response = await api.delete(`/admin/doctors/${doctorId}`);
    return response.status;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error('Doctor not found.');
      } else {
        throw new Error('An error occurred while deleting the doctor.');
      }
    } else {
      throw new Error(`Failed to delete doctor: ${error.message}`);
    }
  }
};

export const getPatients = async (params) => {
  try {
    const response = await api.get('/admin/patients', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

export const deletePatient = async (patientId) => {
  try {
    const response = await api.delete(`/admin/patients/${patientId}`);
    return response.status;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error('Patient not found.');
      } else {
        throw new Error('An error occurred while deleting the patient.');
      }
    } else {
      throw new Error(`Failed to delete patient: ${error.message}`);
    }
  }
};

export const getAppointments = async (params) => {
  try {
    const response = await api.get('/admin/appointments', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const getDoctorActiveAppointments = async (params) => {
  try {
    const response = await api.get('/doctor/active/appointments', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const getDoctorInactiveAppointments = async (params) => {
  try {
    const response = await api.get('/doctor/inactive/appointments', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const fetchDoctor = async (doctorId) => {
  const response = await api.get(`/doctors/${doctorId}`);
  return response.data;
};

export const fetchPatient = async (patientId) => {
  const response = await api.get(`/patients/${patientId}`);
  return response.data;
};

export const fetchTimeslot = async (doctor_id, patient_id) => {
  const response = await api.get(`/timeslots/${doctor_id}/${patient_id}`);
  return response.data;
};

export const markAppointmentAsInactive = async (appointment_id) => {
  const response = await api.patch(`/appointments/${appointment_id}/inactive`);
  return response.data;
};

export const patientDelete = async (userId, token) => {
  try {
    const response = await api.delete(`/patients/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const doctorDelete = async (userId, token) => {
  try {
    const response = await api.delete(`/doctors/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

