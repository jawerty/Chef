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
            	console.log(event.target.src)
            	sendContent(event.target.src)
            } else {
            	console.log(window.getSelection().toString());
            	sendContent(window.getSelection().toString());
            }
            break;
        default:
            //alert('You have a strange mouse');
    }
});
