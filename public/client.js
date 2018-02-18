// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

var w = '<div class="w-100"></div>';
var counter = 0;

function getCookie(cname) {
    var recents = Cookies.get(cname);
    var parsed = recents ? JSON.parse(recents) : []
    return parsed
}

function saveCookie(cname, data){
  sortRecentsByDate(data)
  return Cookies.set(cname, JSON.stringify(data) , { path: '/', expires: 7 })
}

function fill(objs){
  $('#results').empty();
    objs.forEach(function(obj, index) {
      var widthComp = index % 2 == 0 ? w : ''
      $(widthComp + '<div class="col-sm-6">'
          + '<img src="' + obj.link + '" class="img-fluid" />' 
        + '</div>').appendTo('#results');
    });
}

function imageLoaded() {
   // function to invoke for loaded image
   // decrement the counter
   console.error("call imageLoaded", counter)
   counter--; 
   if( counter <= 0 ) {
       // counter is 0 which means the last
       //    one loaded, so do something else
     //console.error("all loaded")
     $('#loading').modal('hide')
   }
}

function sortRecentsByDate(recents){
  recents.sort(function(a,b){
    return new Date(b.date) - new Date(a.date);
  });
}

function search(query){
   //https://nostalgic-apparatus.glitch.me/imagasearch/cats
    $.get('/imagasearch/' + query + '?offset=10', function(objs) {
      $('#loading').modal('show')
      fill(objs);
      //$('#result-list').empty();
    })
    .done(function() {
      //alert( "second success" );
      var recents = getCookie('recents')
      var data = [];
      console.log('recents', recents)
      if(!recents){
        data.push({query: query, date: new Date()})
        saveCookie('recents',data)
      } else {
        recents = JSON.parse(recents);
        if(recents.length > 3){
          recents.pop();
        }
        recents.push({query: query, date: new Date()})
        updateRecentsScreen(recents);
        saveCookie('recents', recents)
      }
    })
    .fail(function() {
      $('#loading').modal('hide')
      
    })
    .always(function() {
      //alert( "finished" );
      
      var images = $("img.img-fluid");
      counter = images.length;
      
      console.log('img',images)
      
      images.each(function() {
        if( this.complete ) {
            imageLoaded.call( this );
        } else {
            $(this).one('load', imageLoaded);
        }
      });
    }); 
}

function makeSearch(query){
  search(query)
}

function updateRecentsScreen(recents){
  $("#result-list").empty();
   recents = typeof recents === 'string' ? JSON.parse(recents) : recents;
   if(recents){
     console.log(recents)
     recents.forEach(function(item){
        $('<a onClick="makeSearch(\'' + item.query  + '\')" class="list-group-item list-group-item-action">' + item.query + '</a>')
          .appendTo("#result-list")
    }) 
  } 
}

$(function() {
  console.log('hello world :o');
  
  
  
  var recents = getCookie('recents');
  console.log('recents', recents)
  sortRecentsByDate(recents);
  updateRecentsScreen(recents);


  $('form').submit(function(event) {
    event.preventDefault();
    var query = $('input').val();
    
    //https://nostalgic-apparatus.glitch.me/imagasearch/cats
    search(query)
    
  });

});

$(window).load(function() {
  // this will fire after the entire page is loaded, including images
  console.log('loaded all images')
  $('#loading').modal('hide')
});
