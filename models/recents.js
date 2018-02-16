var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Recents = new Schema({
  searched:  String,
  date: { type: Date, default: Date.now }
});


var Recents = mongoose.model('Recents', Recents);

module.exports = Recents;