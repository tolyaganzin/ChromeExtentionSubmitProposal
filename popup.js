// url page path
var urlpage = '';

// worck with data after get them out current tab
function doStuffWithDOM(element) {

  // add data to popup view
  $('h5').addClass("hide");

  for (var i = 0; i < element.length; i++) {
    var preElement = $('pre.hide').clone();

    $(preElement).removeClass("hide");
    $(preElement).text(element[i]);

    $('div.content').append($(preElement));
  }

  // check and save data to local storage
  chrome.storage.local.get(["proposals"], function(items){
    var proposals = [];
    // check data
    if (items.proposals) {
      // if local storage not empty
      proposals = items.proposals;

      // if local storage has not this proposal, save them
      if(!$.grep(proposals, function(e){ return e.urlpage == $(urlpage).text() }).length) {
        proposals.push({'urlpage': $(urlpage).text(), 'questions': element});
        chrome.storage.local.set({ "proposals": proposals}, function(){});
      } else {
        // update this proposal
        $.grep(proposals, function(e){
          // find and update
          if(e.urlpage == $(urlpage).text()) {
            e.questions = element;
          }
        });
        chrome.storage.local.set({ "proposals": proposals}, function(){});
      }

    } else {
      // if local storage empty, set first proposal
      proposals.push({'urlpage': $(urlpage).text(), 'questions': element});
      chrome.storage.local.set({ "proposals": proposals}, function(){});
    }
  });
}

// save current proposal to local storage
function save() {

  $('div.content').addClass("hide");
  $('div.content').empty();
  $('h5.hide').removeClass("hide");
  $('#notFound').addClass("hide");

  chrome.tabs.getSelected(null,function(tab) {
    // get current tab url and work with it
    $.get(tab.url, function( htmlCurrentPage ) {

      // fill popup content
      urlpage = $('#bidName').clone();
      $('div.content').removeClass("hide");
      $('div.content').append($(urlpage).text(tab.url).attr("href", tab.url));

      // work with current tab
      chrome.tabs.sendMessage(tab.id, { text: "report_back" }, doStuffWithDOM);
    });
  });
}

// find current proposal in local storage
function find() {
  $('div.content').empty();

  // get current tab url and data from local storage
  chrome.tabs.getSelected(null,function(tab) {
    var urlBid = tab.url;
    var idBid = urlBid.match(/~([0-9a-z]*)/);
    console.log(idBid[1]);

    // get current tab url and work with it
    $.get(tab.url, function( htmlCurrentPage ) {
      console.log($(htmlCurrentPage).find('span.organization-selector').text());
    });

    chrome.storage.local.get(["proposals"], function(items){
      // if local storage is not empty
      if (items.proposals) {
        // if has this proposal
        if($.grep(items.proposals, function(e){ return e.urlpage == tab.url }).length) {
          // fill contetnt popup
          urlpage = $('#bidName').clone();
          $('div.content').append($(urlpage).text(tab.url).attr("href", tab.url));
          $('div.content').removeClass("hide");

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

        } else {
          // if has not this proposal in local storage
          $('#notFound').removeClass("hide");
        }

      } else {
        // if empty
        $('#notFound').removeClass("hide");
      }
    });

  });
}

// remove all proposals from local storafe
function removeAll() {
  // work with content
  $('#notFound').addClass("hide");
  $('div.content').addClass("hide");
  $('div.content').empty();
  // clear local storage
  chrome.storage.local.clear();
}

// on window load listen this ivents
function onWindowLoad() {
  $('#save').click(function() {
    save();
  });
  $('#find').click(function() {
    find();
  });
  $('#removeAll').click(function() {
    removeAll();
  });
}

window.onload = onWindowLoad;
