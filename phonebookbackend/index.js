const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json()); // Middleware to parse JSON

// Custom Morgan token to log request body for POST requests
morgan.token('post-data', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

// Use Morgan with the custom token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    const totalEntries = persons.length;
    const currentTime = new Date().toString();

    res.send(`
        <h1>Phonebook Info</h1>
        <p>Phonebook has info for ${totalEntries} people</p>
        <p>${currentTime}</p>
    `);
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(p => p.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).json({ error: "Person not found" });
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const initialLength = persons.length;

    persons = persons.filter(p => p.id !== id);

    if (persons.length < initialLength) {
        res.status(204).end();
    } else {
        res.status(404).json({ error: "Person not found" });
    }
});

// Helper function to generate a unique ID
const generateId = () => {
    return Math.floor(Math.random() * 1000000).toString(); // Large enough to avoid duplicates
};

// POST route to add a new person with error handling
app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;

    // Validate input
    if (!name || !number) {
        return res.status(400).json({ error: "Name and number are required" });
    }

    // Check if name already exists
    if (persons.some(person => person.name === name)) {
        return res.status(400).json({ error: "Name must be unique" });
    }

    const newPerson = {
        id: generateId(),
        name,
        number
    };

    persons.push(newPerson);
    res.status(201).json(newPerson); // Return the created person with 201 status
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
