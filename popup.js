/* A function creator for callbacks */
function doStuffWithDOM(element) {
  console.log(element);
  $('h6').addClass("hide");
  for (var i = 0; i < element.length; i++) {
    var preElement = $('pre.hide').clone();

    $(preElement).removeClass("hide");
    $(preElement).text(element[i]);

    $('div.content').append($(preElement));
  }
}
function toDoPizdato() {

  $('h6.hide').removeClass("hide");

  chrome.tabs.getSelected(null,function(tab) {
    ////auto get test
    $.get(tab.url, function( htmlCurrentPage ) {

      $('div.content').removeClass("hide");
      $('div.content').empty();
      var url = $('#bidName').clone();
      $('div.content').append($(url).text(tab.url).attr("href", tab.url));

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
  })

}

window.onload = onWindowLoad;
