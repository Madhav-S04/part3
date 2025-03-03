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
app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(persons => {
            res.json(persons);
        })
        .catch(error => {
            console.error('Error fetching persons:', error);
            res.status(500).json({ error: 'Failed to fetch persons' });
        });
});

// ✅ Fetch a single person by ID
app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).json({ error: "Person not found" });
            }
        })
        .catch(error => {
            console.error('Error fetching person:', error);
            res.status(400).json({ error: 'Invalid ID format' });
        });
});

// ✅ DELETE a person
app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            if (result) {
                res.status(204).end();
            } else {
                res.status(404).json({ error: "Person not found" });
            }
        })
        .catch(error => {
            console.error('Error deleting person:', error);
            res.status(400).json({ error: 'Invalid ID format' });
        });
});

// ✅ POST: Add new person to MongoDB
app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: 'Name or number is missing' });
    }

    const person = new Person({ name, number });

    person.save()
        .then(savedPerson => {
            res.json(savedPerson);
        })
        .catch(error => {
            console.error('Error saving person:', error);
            res.status(500).json({ error: 'Failed to save person' });
        });
});

// ✅ INFO Route
app.get('/info', (req, res) => {
    Person.countDocuments({})
        .then(count => {
            const currentTime = new Date().toString();
            res.send(`
                <h1>Phonebook Info</h1>
                <p>Phonebook has info for ${count} people</p>
                <p>${currentTime}</p>
            `);
        })
        .catch(error => {
            console.error('Error fetching person count:', error);
            res.status(500).json({ error: 'Failed to fetch person count' });
        });
});

// ✅ Catch-all for serving frontend (must be LAST)
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// ✅ Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
