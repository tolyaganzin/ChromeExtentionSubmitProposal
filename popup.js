/* A function creator for callbacks */
var urlpage = '';
  // chrome.storage.local.clear();
function doStuffWithDOM(element) {

  $('h6').addClass("hide");

  for (var i = 0; i < element.length; i++) {
    var preElement = $('pre.hide').clone();

    $(preElement).removeClass("hide");
    $(preElement).text(element[i]);

    $('div.content').append($(preElement));
  }

  chrome.storage.local.get(["proposals"], function(items){
    var arr = [];
    if (items.proposals) {
      if(!$.grep(items.proposals, function(e){ return e.urlpage == $(urlpage).text() }).length) {
        arr = items.proposals;
        arr.push({'urlpage': $(urlpage).text(), 'questions': element});
        console.log(arr);
        chrome.storage.local.set({ "proposals": arr}, function(){});
      } else {
        console.log("has this proposals");
      }
    } else {
      arr.push({'urlpage': $(urlpage).text(), 'questions': element});
      console.log(arr);
      chrome.storage.local.set({ "proposals": arr}, function(){});
    }
  });
}
function toDoPizdato() {

  $('h6.hide').removeClass("hide");

  chrome.tabs.getSelected(null,function(tab) {
    ////auto get test
    $.get(tab.url, function( htmlCurrentPage ) {

      $('div.content').removeClass("hide");
      $('div.content').empty();
      urlpage = $('#bidName').clone();
      $('div.content').append($(urlpage).text(tab.url).attr("href", tab.url));

      chrome.tabs.sendMessage(tab.id, { text: "report_back" }, doStuffWithDOM);
    });
  });
}
function onWindowLoad() {

  $('#save').click(function() {
    toDoPizdato();
  })
  $('#find').click(function() {
    $('div.content').removeClass("hide");
    $('div.content').empty();

    chrome.tabs.getSelected(null,function(tab) {
      chrome.storage.local.get(["proposals"], function(items){
        if (items.proposals) {
          if($.grep(items.proposals, function(e){ return e.urlpage == tab.url }).length) {
            urlpage = $('#bidName').clone();
            $('div.content').append($(urlpage).text(tab.url).attr("href", tab.url));

            $.grep(items.proposals, function(e){
               if(e.urlpage == tab.url) {
                 for (var i = 0; i < e.questions.length; i++) {
                   var preElement = $('pre.hide').clone();

                   $(preElement).removeClass("hide");
                   $(preElement).text(e.questions[i]);

                   $('div.content').append($(preElement));
                 }
               }
            });
            
          }

        } else {
          urlpage = $('#bidName').clone();
          $('div.content').append($(urlpage).text(empty).attr("href", '#'));
        }
      });

    });
  })

}

window.onload = onWindowLoad;
