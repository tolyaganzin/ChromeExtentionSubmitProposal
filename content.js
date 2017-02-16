/* Listen for messages */
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    /* If the received message has the expected format... */
    console.log(1);
    if (msg.text && (msg.text == "report_back")) {
        /* Call the specified callback, passing
           the web-pages DOM content as argument */
      // sendResponse(document.getElementById("mybutton").innerHTML);
      var questions = document.querySelectorAll("textarea[id^='question']");
      var arr = [];
      for (var i = 0; i < questions.length; i++) {
        arr.push(questions[i].value);
      }
      console.log(arr);
      sendResponse(arr);
    }
});
