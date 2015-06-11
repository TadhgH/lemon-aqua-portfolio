// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Projects', new Schema({
    title: String,
    outline: String,
    body: String,
    tags: [],
    created: {
      type: Date,
      default: Date.now
    }
}));
