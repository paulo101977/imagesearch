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

function search(query){
   //https://nostalgic-apparatus.glitch.me/imagasearch/cats
    $.get('/imagasearch/' + query + '?offset=10', function(objs) {
      $('#loading').modal('show')
      fill(objs);
      $('#result-list').empty();
    })
    .done(function() {
      //alert( "second success" );
    })
    .fail(function() {
      $('#loading').modal('hide')
      
    })
    .always(function() {
      //alert( "finished" );
      
    }); 
}

$(function() {
  console.log('hello world :o');
  
  $.get('/recents/', function(objs) {
      console.log(objs)
      objs.forEach(function(item){
        $('<a class="list-group-item list-group-item-action">' + item.searched + '</a>').appendTo("#result-list")
      })
  })
  
  function imageLoaded() {
     // function to invoke for loaded image
     // decrement the counter
     counter--; 
     if( counter === 0 ) {
         // counter is 0 which means the last
         //    one loaded, so do something else
       console.log('all images loaded')
     }
  }
  var images = $('img');
  var counter = images.length;  // initialize the counter

  images.each(function() {
      if( this.complete ) {
          imageLoaded.call( this );
      } else {
          $(this).one('load', imageLoaded);
      }
  });

  $('form').submit(function(event) {
    event.preventDefault();
    var query = $('input').val();
    
    //https://nostalgic-apparatus.glitch.me/imagasearch/cats
    search(quer
    
    
  });

});

$(window).load(function() {
  // this will fire after the entire page is loaded, including images
  console.log('loaded all images')
  $('#loading').modal('hide')
});
