function sendContent(_content) {
	chrome.runtime.sendMessage({getContent: _content}, function(response) {
	  if (response.back) {
	  	chrome.runtime.sendMessage({another: "message"}, function(response) {

		});
	  }
	});
}

$(document).mousedown(function(event) {
    switch (event.which) {
        case 3:
            if (event.target.src) {
            	console.log("image")
            	sendContent(event.target.src)
            } else {
            	console.log("text")
            	sendContent(window.getSelection().toString());
            }
            break;
        default:
            //alert('You have a strange mouse');
    }
});
