const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectToDatabase = require('./db'); // Assuming db.js is in the same folder

// Fetch all gifts
router.get('/', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB and store connection to db constant
        const db = await connectToDatabase();

        // Task 2: Use the collection() method to retrieve the gift collection
        const collection = db.collection("gifts");

        // Task 3: Fetch all gifts using the collection.find method. Chain with toArray method to convert to JSON array
        const gifts = await collection.find({}).toArray();

        // Task 4: Return the gifts using the res.json method
        res.json(gifts);
    } catch (e) {
        console.error('Error fetching gifts:', e);
        res.status(500).send('Error fetching gifts');
    }
});

// Fetch a specific gift by ID
router.get('/:id', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB and store connection to db constant
        const db = await connectToDatabase();

        // Task 2: Use the collection() method to retrieve the gift collection
        const collection = db.collection("gifts");

        const id = req.params.id;

        // Task 3: Find a specific gift by ID using the collection.findOne method and store in constant called gift
        const gift = await collection.findOne({ _id: new ObjectId(id) });

        if (!gift) {
            return res.status(404).send('Gift not found');
        }

        // Return the specific gift
        res.json(gift);
    } catch (e) {
        console.error('Error fetching gift:', e);
        res.status(500).send('Error fetching gift');
    }
});

// Add a new gift
router.post('/', async (req, res, next) => {
    try {
        // Task 1: Connect to MongoDB and store connection to db constant
        const db = await connectToDatabase();

        // Task 2: Use the collection() method to retrieve the gift collection
        const collection = db.collection("gifts");

        // Task 3: Insert a new gift into the collection
        const result = await collection.insertOne(req.body);

        // Task 4: Return the inserted document (with the ID)
        res.status(201).json(result.ops[0]);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
