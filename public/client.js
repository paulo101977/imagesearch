// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

var w = '<div class="w-100"></div>';

$(function() {
  console.log('hello world :o');
  
  $.get('/imagasearch/cats?offset=10', function(objs) {
    $('#results').empty();
    objs.forEach(function(obj,) {
      console.log('object',obj.link)
      $('<div class="col-4">'
          + '<img src="' + obj.link + '" class="img-fluid" />' 
        + '</div>').appendTo('#results');
    });
  });

  $('form').submit(function(event) {
    event.preventDefault();
    var query = $('input').val();
    
    //https://nostalgic-apparatus.glitch.me/imagasearch/cats
    $.get('/imagasearch/' + query + '?offset=10', function(objs) {
      $('#results').empty();
      objs.forEach(function(obj) {
        console.log('object',obj.link)
        $('<div class="col-4">'
            + '<img src="' + obj.link + '" class="img-fluid" />' 
          + '</div>').appendTo('#results');
      });
    });
  });

});
