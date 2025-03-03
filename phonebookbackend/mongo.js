const mongoose = require('mongoose');

// Get command-line arguments
const args = process.argv;

// Ensure password is provided
if (args.length < 3) {
  console.log('Usage: node mongo.js <password> [name] [number]');
  process.exit(1);
}

// Get password from command-line arguments
const password = args[2];

// MongoDB Atlas connection URL (replace <password> with actual password)
const url = `mongodb+srv://madhavpattambi:madhav@cluster0.1gsmp.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(url);

// Define a Mongoose Schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// Create a Mongoose Model
const Person = mongoose.model('Person', personSchema);

// If only password is provided, list all contacts
if (args.length === 3) {
  Person.find({}).then((persons) => {
    console.log('Phonebook:');
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (args.length === 5) {
  // If name and number are provided, add new contact
  const name = args[3];
  const number = args[4];

  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log('Invalid number of arguments.');
  process.exit(1);
}
