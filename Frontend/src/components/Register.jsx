// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export default function Register() {
//   const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' });
//   const navigate = useNavigate();

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/api/register', form);
//       navigate('/login');
//     } catch (err) {
//       alert(err.response.data.error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="name" placeholder="Name" onChange={handleChange} required />
//       <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
//       <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//       <select name="role" onChange={handleChange}>
//         <option value="patient">Patient</option>
//         <option value="doctor">Doctor</option>
//       </select>
//       <button type="submit">Register</button>
//     </form>
//   );
// }