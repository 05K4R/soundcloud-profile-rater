var currentSong;
var profile;
var reposter;

/*
key: username
value: {
    totalLikes: int
    totalDislikes: int
    likes: [
        {
            profile: string
            song: string
        }
    ]
    dislikes: [
        {
            profile: string
            song: string
        }
    ]
}
*/

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
	} else if (request.subject === 'likeSong') {
		chrome.storage.sync.set({'test': ['value1', 'value2']}, function() {
			sendResponse("Liked!");
		});
		return true;
	} else if (request.subject === 'dislikeSong') {
		chrome.storage.sync.set({'test2': 'value'}, function() {
			sendResponse('Disliked!');
		});
		return true;
	}
	return false;
});
