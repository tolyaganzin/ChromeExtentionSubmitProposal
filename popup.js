function onWindowLoad() {

  /* A function creator for callbacks */
  function doStuffWithDOM(element) {
    console.log(element);
    for (var i = 0; i < element.length; i++) {
      $('div.content').append($('<pre></pre>').text(element[i]));
    }
  }
  $('#save').click(function() {
    toDoPizdato();
  })

  function toDoPizdato() {

    chrome.tabs.getSelected(null,function(tab) {
      console.log('teb', tab);

      ////auto get test
      $.get(tab.url, function( htmlCurrentPage ) {
        var tmp = $(htmlCurrentPage).find("h1.m-0-top").text().trim();

        $('#bidName').text($(htmlCurrentPage).find("label.ng-binding").first().text()).attr("href", tab.url);

        chrome.tabs.sendMessage(tab.id, { text: "report_back" }, doStuffWithDOM);
      });
    });
  }
}

window.onload = onWindowLoad;
