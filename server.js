// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var config = require('./config.js');
var http = require('https');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

//https://api.imgur.com/3/gallery/search/?q=cats
var options = {
  host: 'api.imgur.com',
  path: '/3/gallery/search/',
  headers : {'Authorization':  config.authorization},
};

app.get("/imagasearch/:img",function(req, res, next){
  let img = req.params.img;
  let offset = req.params.offset;
  console.log(req.params.img)
  if(img){
    //http.get();
    //res.json({img: img})
    options.path += '?q=' + img; 
    
    //if(offset) options.path += '&perPage=' + offset
    
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
        
        if(offset && data.length > 0) {
          offset = +offset; //to number
          data.slice()
        }
        res.json(JSON.parse(body.toString()));
      })
      
    })
    request.end();
  }
  //next();
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
