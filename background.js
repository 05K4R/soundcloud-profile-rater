var currentSong;
var profile;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.subject === 'getCurrentSong') {
		var response = {
			song: currentSong,
			profile: profile
		}

		sendResponse(response);
	} else if (request.subject === 'updateSong') {
		currentSong = request.song;
		profile = request.profile;

		sendResponse("Current song and profile updated");
	}
});
