const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  reason: String,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
