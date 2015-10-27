var song;
var profile;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.method === 'getInfo') {
		sendResponse(song);
		return;
	}

	song = request.song;
	profile = request.profile;

	console.log("Song: " + request.song + ", Profile: " + request.profile);
	sendResponse("Song: " + request.song + ", Profile: " + request.profile);
});
