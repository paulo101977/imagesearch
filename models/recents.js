var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecentsSchema = new Schema({
  searched:  String,
  date: { type: Date, default: Date.now }
});


var Recents = mongoose.model('Recents', RecentsSchema);

module.exports = Recents;