/*jshint esversion: 8 */ 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');
const { loadData } = require("./util/import-mongo/index");

const app = express();
app.use("*", cors()); // Middleware for handling CORS
const port = 3060;

// Connect to MongoDB; we just do this one time
connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
})
    .catch((e) => console.error('Failed to connect to DB', e));

app.use(express.json()); // Middleware for parsing JSON bodies

// Route files
// Gift API Task 1: Import the giftRoutes and store in a constant called giftRoutes
const giftRoutes = require('./routes/giftRoutes'); // Importing gift routes

// Search API Task 1: Import the searchRoutes and store in a constant called searchRoutes
const searchRoutes = require('./routes/searchRoutes'); // Importing search routes

const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger })); // Middleware for logging HTTP requests

// Use Routes
// Gift API Task 2: Add the giftRoutes to the server by using the app.use() method
app.use('/api/gifts', giftRoutes); // Attaching gift routes to /api/gifts

// Search API Task 2: Add the searchRoutes to the server by using the app.use() method
app.use('/api/search', searchRoutes); // Attaching search routes to /api/search

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

// Default route for root
app.get("/", (req, res) => {
    res.send("Inside the server");
});

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
