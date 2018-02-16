import mongodb from 'mongodb'

import {uri} from 'config'

let seedData = []

mongodb.MongoClient.connect(uri, function(err, db) {
  if(err) throw err;
  

  var recents = db.collection('recents');
  
  
  

    
});