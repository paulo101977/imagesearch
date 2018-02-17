// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var config = require('./config.js');
var http = require('https');
var mongoose = require('mongoose');


//Schemas
var Recents = require('./models/recents.js');


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

//https://api.imgur.com/3/gallery/search/?q=cats
app.get("/imagasearch/:img",function(req, res, next){
  let img = req.params.img;
  let offset = +req.query.offset;
  var options = {
    host: 'api.imgur.com',
    path: '/3/gallery/search/',
    headers : {'Authorization':  config.authorization},
  };
  
  if(img){
    options.path += '?q=' + img; 
  
    
    var bodyChunks = [];

    let request = http.get(options, function(resource) {
      //res.json({resource: resource})
      
      console.log('config.authorization',config.authorization);
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));

      resource.on('data', function(chunk) {
        bodyChunks.push(chunk);
      }).on('end', function() {
        var body = Buffer.concat(bodyChunks); 
        var responseData = JSON.parse(body.toString());
        var data = typeof responseData !== 'undefined' ? responseData.data : [];
        var collection = [];
        data.forEach(function(item){
          if(item.is_album){
            item.images.forEach(function(nItem){
              collection.push(nItem)
            })
          }
        })
        
        if(offset && collection.length > 0) {
          collection = collection.slice(0, offset)
        }
        
        //shuffle
        collection.sort(function() { return 0.5 - Math.random() })
        
        var query = { 'searched': img },
            update = { 'searched': img , date: new Date() },
            options = { upsert: true, new: true, setDefaultsOnInsert: true };

        
        console.log('before find')
        
        //Recents.update({ 'searched': img }, {upsert: true}, function (err) { console.log(err) });
        
        Recents.findOneAndUpdate(query, update, options, function(error, result) {
            if (error) console.log(error);
            console.log('result' , result)
            // do something with the document
        });
        
        Recents.find({},
          function (err, results) {
              if (err) {  console.log(err) }
              if (!results.length) {
                  console.log('new')
                  new Recents({searched:img})
              }
              else{
                  console.log('exits')
              }
          })
        
        res.json(collection);
      })
      
    })
    
    console.log('offset', offset)
    
    request.on('error', function(error){
      console.log(error);
    })
    request.end();
  }
  //next();
})


//mongoose connect
connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);



function listen () {
  app.listen(process.env.PORT);
  console.log('Express app started on port ' + process.env.PORT);
}

function connect () {
  var options = { useMongoClient: true, keepAlive: 1 };
  return mongoose.createConnection(config.uri, options);
}