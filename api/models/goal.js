const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Goal = new Schema({
  userId: {
    type: String,
    required: true
  },
  goalType: {
    type: String,
    required: true
  },
  goalName: {
    type: String,
    required: true
  },
  goalAmount: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Goal', Goal);
