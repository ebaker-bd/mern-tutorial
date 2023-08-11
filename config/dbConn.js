const mongoose = require('mongoose');
const {logEvents} = require('../middleware/logger');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    logEvents(`${err.name}: ${err.message}`, 'errors.log')
  }
}

module.exports = connectDB;
