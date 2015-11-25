var currentSong;
var profile;
var reposter;
var reposterObject = {};
var likePercent;

/*
key: username
value: {
    totalLikes: int
    totalDislikes: int
    likes: [
        {
            profile: string
            song: string
			date: Date
        }
    ]
    dislikes: [
        {
            profile: string
            song: string
			date: Date
        }
    ]
}
*/

function updatePercent() {
	likePercent = (reposterObject.likes).length /
		((reposterObject.likes).length + (reposterObject.dislikes).length)

	likePercent = (likePercent * 100).toFixed();
	likePercent = likePercent + '%';
}

function constructResponse(action) {
	var response = {
		song: currentSong,
		profile: profile,
		reposter: reposter,
		percent: likePercent,
		action: action
	}

	return response;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.subject === 'getCurrentSong') {
		updatePercent();
		sendResponse(constructResponse('Current song updated!'));
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
					dislikes: [],
				}
			}

			updatePercent();
			sendResponse(constructResponse('Song updated!'));
		});
		return true;
	} else if (request.subject === 'likeSong') {
		reposterObject.totalLikes++;

		var today = new Date().toJSON();

		reposterObject.likes.push({
			profile: profile,
			song: currentSong,
			date: today
		});

		var object = {};
		object[reposter] = reposterObject;

		chrome.storage.sync.set(object, function() {
			updatePercent();
			sendResponse(constructResponse('Liked and saved!'));
		});

		return true;
	} else if (request.subject === 'dislikeSong') {
		reposterObject.totalDislikes++;

		var today = new Date().toJSON();

		reposterObject.dislikes.push({
			profile: profile,
			song: currentSong,
			date: today
		});

		var object = {};
		object[reposter] = reposterObject;

		chrome.storage.sync.set(object, function() {
			updatePercent();
			sendResponse(constructResponse('Disliked and saved!'));
		});

		return true;
	}
	return false;
});
