let mongoose = require('mongoose');

// Article Schema
let articleSchema = mongoose.Schema({
  author:{
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  number:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.getTime
  },
  appointmentDate: {
    type: String,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  meetingRoom: {
    type: String,
    required: true
  },
  occupation: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

let Article = module.exports = mongoose.model('Article', articleSchema);
