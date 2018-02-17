// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

var w = '<div class="w-100"></div>';

function fill(objs){
  $('#results').empty();
    objs.forEach(function(obj, index) {
      var widthComp = index % 2 == 0 ? w : ''
      $(widthComp + '<div class="col-sm-6">'
          + '<img src="' + obj.link + '" class="img-fluid" />' 
        + '</div>').appendTo('#results');
    });
}

$(function() {
  console.log('hello world :o');
  
  /*$.get('/imagasearch/cats?offset=10', function(objs) {
    fill(objs);
  });*/

  $('form').submit(function(event) {
    event.preventDefault();
    var query = $('input').val();
    
    //https://nostalgic-apparatus.glitch.me/imagasearch/cats
    $.get('/imagasearch/' + query + '?offset=10', function(objs) {
      fill(objs);
    })
    .done(function() {
      //alert( "second success" );
    })
    .fail(function() {
      alert( "error" );
    })
    .always(function() {
      alert( "finished" );
    });
    
    $('img').on('load', function() {
      // do whatever you want
      alert('finish')
    });
  });

});
