const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = require('./models/User');
const Appointment = require('./models/Appointment');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ 
    token,
    name: user.name,
    role: user.role 
   });
});

app.get('/api/users/:role', authMiddleware, async (req, res) => {
  const users = await User.find({ role: req.params.role });
  res.json(users);
});

app.post('/api/appointments', authMiddleware, async (req, res) => {
  const { doctorId, date, reason } = req.body;
  const appointment = new Appointment({
    doctor: doctorId,
    patient: req.user.id,
    date,
    reason,
  });
  await appointment.save();
  res.status(201).json({ message: 'Appointment booked' });
});

app.delete('/api/appointments/:id', authMiddleware, async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.sendStatus(404);
  if (appointment.patient.toString() !== req.user.id && appointment.doctor.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  await appointment.deleteOne();
  res.json({ message: 'Appointment cancelled' });
});

app.get('/api/appointments', authMiddleware, async (req, res) => {
  const appointments = await Appointment.find({
    $or: [{ patient: req.user.id }, { doctor: req.user.id }],
  }).populate('doctor patient', 'name email');
  res.json(appointments);
});

app.listen(5000, () => console.log('Server running on port 5000'))