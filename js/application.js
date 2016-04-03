(function() {
  var hackerNewsArticlesUrl = "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"
  var hackerNewsArticleUrl = "https://hacker-news.firebaseio.com/v0/item/:id.json?print=pretty"

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
  }
  
  if (!getCookie('hackerNewsRefresh')) {
    localStorage.clear();
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.cookie = "hackerNewsRefresh=true; expires="+ tomorrow + ";"
  }

  var renderData = function(data) {
    html = "<div class='item'><a href='" + data.url + "'>" +
           "<img class='item-image' src='http://http2pic.melnychuk.me/?url=" + data.url + "' >" +
           "<div class='item-text'>" + data.title + "</div>" +
            "</a></div>";
    document.getElementById('items').innerHTML += html;
  }

  var fetchArticle = function(id) {
    if (localStorage.getItem(id)) {
      data = JSON.parse(localStorage.getItem(id)); 
      renderData(data);
      return;
    }

    promise.get( hackerNewsArticleUrl.replace(':id', id) ).then( function( error, text, xhr) {
      if (error) {
        console.error(error);
        return;
      }

      data = JSON.parse(text); 
      renderData(data);
      localStorage.setItem(id, text);
    });
  }

  if (sessionStorage.getItem('articlesList')) {
    var data = JSON.parse( sessionStorage.getItem('articlesList') );

    _.forEach( _.take(data, 20), function(id) {
      fetchArticle(id);
    })
  } else {
    promise.get(hackerNewsArticlesUrl).then( function( error, text, xhr) {
      var p = new promise.Promise();
      
      if (error) {
        console.error(error);
        p.done(error, []);
        return p;
      }
      sessionStorage.setItem('articlesList', text);
      var data = JSON.parse(text);

      p.done(null, data);
      return p;
    }).then( function(error, data) {
      _.forEach( _.take(data, 20), function(id) {
        fetchArticle(id);
      })
    })
  }
})();

