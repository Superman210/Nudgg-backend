const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Account = new Schema({
  providerId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Account', Account);
