/* A function creator for callbacks */
var urlpage = '';
  // chrome.storage.local.clear();
function doStuffWithDOM(element) {

  $('h5').addClass("hide");

  for (var i = 0; i < element.length; i++) {
    var preElement = $('pre.hide').clone();

    $(preElement).removeClass("hide");
    $(preElement).text(element[i]);

    $('div.content').append($(preElement));
  }

  chrome.storage.local.get(["proposals"], function(items){
    var arr = [];
    if (items.proposals) {
      arr = items.proposals;

      if(!$.grep(arr, function(e){ return e.urlpage == $(urlpage).text() }).length) {
        arr.push({'urlpage': $(urlpage).text(), 'questions': element});
        console.log(arr);
        chrome.storage.local.set({ "proposals": arr}, function(){});
      } else {
        console.log("update proposal");
        $.grep(arr, function(e){
           if(e.urlpage == $(urlpage).text()) {
             e.questions = element;
           }
        });
        chrome.storage.local.set({ "proposals": arr}, function(){});
      }

    } else {
      arr.push({'urlpage': $(urlpage).text(), 'questions': element});
      console.log(arr);
      chrome.storage.local.set({ "proposals": arr}, function(){});
    }
  });
}
function toDoPizdato() {

  $('div.content').addClass("hide");
  $('div.content').empty();
  $('h5.hide').removeClass("hide");
  $('#notFound').addClass("hide");

  chrome.tabs.getSelected(null,function(tab) {
    ////auto get test
    $.get(tab.url, function( htmlCurrentPage ) {

      urlpage = $('#bidName').clone();
      $('div.content').removeClass("hide");
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

                   $('div.content').removeClass("hide");
                   $('div.content').append($(preElement));
                 }
               }
            });

          }

        } else {
          $('#notFound').removeClass("hide");
        }
      });

    });
  })

  $('#removeAll').click(function() {
    $('#notFound').addClass("hide");
    $('div.content').addClass("hide");
    $('div.content').empty();
    chrome.storage.local.clear();
  });
}

window.onload = onWindowLoad;
