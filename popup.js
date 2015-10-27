function setChildTextNode(elementId, text) {
	document.getElementById(elementId).innerText = text;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	setChildTextNode('current-song', 'Testing this shit out!');

	sendResponse("Response from popup.js");
});

chrome.runtime.sendMessage({'method': 'getInfo'}, function(response) {
	setChildTextNode('current-song', response);
});
