import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import './Dashboard.css';

export default function Dashboard() {
  const [appointment, setAppointment] = useState({ doctorId: '', date: '', reason: '' });
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setRole(localStorage.getItem('role'));
    setName(localStorage.getItem('name'));

    const token = localStorage.getItem('token');

    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/doctor', {
          headers: { Authorization: token },
        });
        setDoctors(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch doctors');
      }
    };

    const fetchAppointments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/appointments', {
          headers: { Authorization: token },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch appointments');
      }
    };

    fetchAppointments();
    fetchDoctors();
  }, []);

  const handleChange = e => setAppointment({ ...appointment, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/appointments', appointment, {
        headers: { Authorization: token },
      });
      alert('Appointment booked successfully');
      setAppointment({ doctorId: '', date: '', reason: '' });
      window.location.reload();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/');
  };

  return (
    <div className="container">
      <h2>Welcome {role === 'doctor' ? 'Doctor' : 'Patient'} {name}</h2>
     <button onClick={handleLogout} style={{ float: 'right', marginBottom: '1rem' }}>
        Logout
      </button>

      {role === 'patient' ? (
        <>
          <h3>Book an Appointment</h3>
          <form onSubmit={handleSubmit}>
            <select name="doctorId" value={appointment.doctorId} onChange={handleChange} required>
              <option value="">Select Doctor</option>
              {doctors.map(doc => (
                <option key={doc._id} value={doc._id}>{doc.name}</option>
              ))}
            </select>
            <input type="date" name="date" value={appointment.date} onChange={handleChange} required />
            <input type="text" name="reason" placeholder="Reason" value={appointment.reason} onChange={handleChange} required />
            <button type="submit">Book Appointment</button>
          </form>
          <h3>Your Appointments</h3>
          <ul>
            {appointments.map(app => (
              <li key={app._id}>
                <strong>Doctor:</strong> {app.doctor?.name} ({app.doctor?.email})<br />
                <strong>Date:</strong> {new Date(app.date).toLocaleDateString()}<br />
                <strong>Reason:</strong> {app.reason}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h3>Appointments</h3>
          <ul>
            {appointments.map(app => (
              <li key={app._id}>
                <strong>Patient:</strong> {app.patient?.name} ({app.patient?.email})<br />
                <strong>Date:</strong> {new Date(app.date).toLocaleDateString()}<br />
                <strong>Reason:</strong> {app.reason}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}