 var config = require('./config')



const mongoose = require('mongoose');
mongoose.connect(config.uri);


module.exports = mongoose;

/*mongodb.MongoClient.connect(uri, function(err, db) {
  if(err) throw err;
  

  var recents = db.collection('recents');
  
  
  

    
});*/