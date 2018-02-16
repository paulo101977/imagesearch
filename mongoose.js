 var config = require('./config')



const mongoose = require('mongoose');


module.exports = mongoose.connect(config.uri).connection;
