const express = require('express');
const connectToMongoDB = require('./config/connection');
const urlRoutes = require('./routes/urlRoutes');
const URL = require('./models/url.models');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToMongoDB('mongodb://127.0.0.1:27017/shortURL');


// Routes
app.use('/url', urlRoutes);


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
