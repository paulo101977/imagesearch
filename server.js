// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var config = require('./config.js');
var http = require('https');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Schemas
var Recents = require('./models/recents.js');


app.use(bodyParser.urlencoded({ extended: true }));


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/recents",function(req, res, next){
  var Rec = Recents(db);
        
  Rec.find({}, function(err, docs) {
    // At this point the jobs collection is created.
    console.log(err, docs);
    if(err) next();
    
    res.json(docs);
  }).sort({'date': -1}).limit(3);
})

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
    
    var img_escaped = img.split(' ').join('+');
    options.path += '?q=' + img_escaped; 
    
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
          //limit the image size
          if(item.is_album){
            item.images.forEach(function(nItem){
              if(nItem.size < 400000){
                collection.push(nItem)
              }
            })
          }
        })
        
        if(offset && collection.length > 0) {
          collection = collection.slice(0, offset)
        }
        
        //shuffle
        collection.sort(function() { return 0.5 - Math.random() })
        
        //connect to db
        var Rec = Recents(db);
        
        Rec.create({searched:img}, function(err, doc) {
          // At this point the jobs collection is created.
          console.log(err,doc);
        });
        
        
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
var db = connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);



function listen () {
  app.listen(process.env.PORT);
  console.log('Express app started on port ' + process.env.PORT);
}

function connect () {
  var options = { keepAlive: 1 };
  return mongoose.createConnection(config.uri, options);
}