var currentSong;
var profile;
var reposter;
var reposterObject = {};

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
			reposter: reposter,
			action: JSON.stringify(reposterObject)
		}

		sendResponse(response);
	} else if (request.subject === 'updateSong') {
		currentSong = request.song;
		profile = request.profile;
		reposter = request.reposter;

		chrome.storage.sync.get(reposter, function(item) {
			if (item[reposter]) {
				reposterObject = item[reposter];
			} else {
				reposterObject = {
					totalLikes: 0,
					totalDislikes: 0,
					likes: [],
					dislikes: []
				}
			}

			sendResponse("Song updated");
		});
		return true;
	} else if (request.subject === 'likeSong') {
		reposterObject.totalLikes++;

		reposterObject.likes.push({
			profile: profile,
			song: currentSong
		});

		var object = {};
		object[reposter] = reposterObject;

		chrome.storage.sync.set(object, function() {
			sendResponse("Liked and saved!");
		});
		return true;
	} else if (request.subject === 'dislikeSong') {
		reposterObject.totalDislikes++;

		reposterObject.dislikes.push({
			profile: profile,
			song: currentSong
		});

		var object = {};
		object[reposter] = reposterObject;

		chrome.storage.sync.set(object, function() {
			sendResponse("Disliked and saved!");
		});
		return true;
	}
	return false;
});
