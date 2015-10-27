var currentSong;
var profile;
var reposter;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.subject === 'getCurrentSong') {
		var response = {
			song: currentSong,
			profile: profile,
			reposter: reposter
		}

		sendResponse(response);
	} else if (request.subject === 'updateSong') {
		currentSong = request.song;
		profile = request.profile;
		reposter = request.reposter;

		sendResponse("Current song and profile updated");
	}
});
