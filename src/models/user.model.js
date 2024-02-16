const mongoose = require('mongoose');

const { Schema } = mongoose;

const user_schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  company: [
    {
      company_name: {
        type: String,
        required: true,
      },
      employer_name: {
        type: String,
        required: true,
      },
    },
  ],
  married: {
    type: Boolean,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
});

const User_Model = mongoose.model('user', user_schema);

module.exports = User_Model;
