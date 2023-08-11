require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const { logEvents } = require('./middleware/logger');
const PORT = process.env.PORT || 3500;

// Connect to mongodb
connectDB();

// Log requests
app.use(logger);

// Enable Cors
app.use(cors(corsOptions));

// Enable Json
app.use(express.json());

// Enable Cookie Parser
app.use(cookieParser());

// Static files
app.use('/', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/root'));

// Default to 404 Page
app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

// Error Handler
app.use(errorHandler);

//Listener for mongoose connection
mongoose.connection.once('open', () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'dbErrors.log')
})

