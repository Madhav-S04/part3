const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const Person = require('./model'); // Import Mongoose model
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// ✅ Serve frontend from "dist"
app.use(express.static('dist'));

// ✅ Fetch all persons from MongoDB
app.get('/api/persons', async (req, res, next) => {
    try {
        const persons = await Person.find({});
        res.json(persons);
    } catch (error) {
        next(error);
    }
});

// ✅ Fetch a single person by ID
app.get('/api/persons/:id', async (req, res, next) => {
    try {
        const person = await Person.findById(req.params.id);
        if (person) {
            res.json(person);
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    } catch (error) {
        next(error);
    }
});

// ✅ DELETE a person
app.delete('/api/persons/:id', async (req, res, next) => {
    try {
        const result = await Person.findByIdAndDelete(req.params.id);
        if (result) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    } catch (error) {
        next(error);
    }
});

// ✅ POST: Add new person to MongoDB
app.post('/api/persons', async (req, res, next) => {
    try {
        const { name, number } = req.body;
        if (!name || !number) {
            return res.status(400).json({ error: 'Name or number is missing' });
        }
        const person = new Person({ name, number });
        const savedPerson = await person.save();
        res.json(savedPerson);
    } catch (error) {
        next(error);
    }
});

// ✅ PUT: Update phone number of an existing person
app.put('/api/persons/:id', async (req, res, next) => {
    try {
        const { name, number } = req.body;
        if (!number) {
            return res.status(400).json({ error: 'Number is missing' });
        }
        const updatedPerson = await Person.findByIdAndUpdate(
            req.params.id,
            { name, number },
            { new: true, runValidators: true, context: 'query' }
        );
        if (updatedPerson) {
            res.json(updatedPerson);
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    } catch (error) {
        next(error);
    }
});

// ✅ INFO Route
app.get('/info', async (req, res, next) => {
    try {
        const count = await Person.countDocuments({});
        const currentTime = new Date().toString();
        res.send(`
            <h1>Phonebook Info</h1>
            <p>Phonebook has info for ${count} people</p>
            <p>${currentTime}</p>
        `);
    } catch (error) {
        next(error);
    }
});

// ✅ Serve frontend for any unknown route (so React works on refresh)
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// ✅ Error Handler Middleware
app.use((error, req, res, next) => {
    console.error('❌ Error:', error.message);
    if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid ID format' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Something went wrong on the server' });
});

// ✅ Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
