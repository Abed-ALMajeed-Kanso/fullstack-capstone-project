const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Search for gifts
router.get('/', async (req, res, next) => {
    try {
        // Task 1: Connect to MongoDB using connectToDatabase database
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        // Initialize the query object
        let query = {};

        // Task 2: Add the name filter to the query if the name parameter is provided
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: "i" }; // Partial match, case-insensitive
        }

        // Task 3: Add other filters to the query
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.condition) {
            query.condition = req.query.condition;
        }
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) }; // Filter by age in years (less than or equal)
        }

        // Task 4: Fetch filtered gifts using the find(query) method
        const gifts = await collection.find(query).toArray();

        // Return the fetched gifts in the response
        res.json(gifts);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
