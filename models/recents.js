var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecentsSchema = new Schema({
  searched:  String,
  date: { type: Date, default: Date.now }
});


module.exports = function(db){
  return db.model('Recents', RecentsSchema);
};