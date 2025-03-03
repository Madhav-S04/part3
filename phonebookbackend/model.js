const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection URL (replace `<password>` with actual password)
const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url);

// Define Schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// Convert MongoDB `_id` field to `id` and remove `__v`
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Export Model
module.exports = mongoose.model('Person', personSchema);
