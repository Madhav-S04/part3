const mongoose = require('mongoose');
require('dotenv').config();

// Custom validator for phone number format
const phoneValidator = {
  validator: function (v) {
    return /^\d{2,3}-\d{5,}$/.test(v); // Ensures format like 09-1234567 or 040-12345678
  },
  message: props => `${props.value} is not a valid phone number! Must be in the form XX-XXXXXXX or XXX-XXXXXXXX`,
};

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
  },
  number: {
    type: String,
    required: [true, 'Number is required'],
    minlength: [8, 'Phone number must be at least 8 characters long'],
    validate: phoneValidator, // ✅ Apply custom validation
  },
});
const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url);
// Convert MongoDB `_id` field to `id` and remove `__v`
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);
