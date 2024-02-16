const mongoose = require('mongoose');
const { Schema } = mongoose;

const request_schema = new Schema({
  name: {
    type: String,
  },
  date_of_request: {
    type: Date,
  },
});

const Request_Model = mongoose.model('request', request_schema);

module.exports = Request_Model;
