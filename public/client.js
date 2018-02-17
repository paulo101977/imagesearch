// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  console.log('hello world :o');
  
  $.get('/imagasearch/cats?offset=10', function(objs) {
    objs.forEach(function(obj) {
      console.log('object',obj.link)
      $('<div class="col-sm-4"><img src="' + obj.link + '" class="img-fluid" /></div>').appendTo('#results');
    });
  });

  $('form').submit(function(event) {
    event.preventDefault();
    var query = $('input').val();
    
    //https://nostalgic-apparatus.glitch.me/imagasearch/cats
    $.get('/imagasearch/' + query + '?offset=10', function() {
      $('<li></li>').text(query).appendTo('#results');
      $('input').val('');
      $('input').focus();
    });
  });

});
