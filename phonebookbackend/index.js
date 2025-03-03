const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const Person = require('./model'); // Import Mongoose model
require('dotenv').config(); // Load environment variables from .env

const app = express();

// ✅ Middleware
app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS for all routes

// ✅ Custom Morgan token to log request body for POST requests
morgan.token('post-data', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

// ✅ Serve frontend from "dist"
app.use(express.static('dist'));

// ✅ Fetch all persons from MongoDB
app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(persons => res.json(persons))
        .catch(error => next(error)); // Forward error to middleware
});

// ✅ Fetch a single person by ID
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).json({ error: 'Person not found' });
            }
        })
        .catch(error => next(error)); // Forward error
});

// ✅ DELETE a person
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            if (result) {
                res.status(204).end();
            } else {
                res.status(404).json({ error: 'Person not found' });
            }
        })
        .catch(error => next(error)); // Forward error
});

// ✅ POST: Add new person to MongoDB
app.post('/api/persons', (req, res, next) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: 'Name or number is missing' });
    }

    const person = new Person({ name, number });

    person.save()
        .then(savedPerson => res.json(savedPerson))
        .catch(error => next(error)); // Forward error
});

// ✅ PUT: Update phone number of an existing person
app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body;

    if (!number) {
        return res.status(400).json({ error: 'Number is missing' });
    }

    Person.findByIdAndUpdate(
        req.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' } // ✅ Enforce validation
    )
        .then(updatedPerson => {
            if (updatedPerson) {
                res.json(updatedPerson);
            } else {
                res.status(404).json({ error: 'Person not found' });
            }
        })
        .catch(error => next(error)); // Forward error
});

// ✅ INFO Route
app.get('/info', (req, res, next) => {
    Person.countDocuments({})
        .then(count => {
            const currentTime = new Date().toString();
            res.send(`
                <h1>Phonebook Info</h1>
                <p>Phonebook has info for ${count} people</p>
                <p>${currentTime}</p>
            `);
        })
        .catch(error => next(error)); // Forward error
});

// ✅ Middleware: Handle unknown endpoints
app.use((req, res) => {
    res.status(404).json({ error: 'Unknown endpoint' });
});

// ✅ Error Handler Middleware
app.use((error, req, res, next) => {
    console.error('❌ Error:', error.message);

    if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid ID format' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message }); // ✅ Send detailed validation error
    }

    res.status(500).json({ error: 'Something went wrong on the server' });
});

// ✅ Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
