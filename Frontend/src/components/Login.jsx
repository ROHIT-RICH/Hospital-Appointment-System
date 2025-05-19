// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const navigate = useNavigate();

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/login', form);
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('role', res.data.role);
//       localStorage.setItem('name', res.data.name);
//       navigate('/dashboard');
//     } catch (err) {
//       alert('Login failed');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
//       <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//       <button type="submit">Login</button>
//     </form>
//   );
// }