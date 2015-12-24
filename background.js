var currentSong;
var profile;
var reposter;
var reposterObject = {};
var likePercent;
var okayPercent;
var dislikePercent;

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
	okays: [
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
	var totalVotes = (reposterObject.likes).length +
		(reposterObject.dislikes).length +
		(reposterObject.okays).length;

	likePercent = (reposterObject.likes).length / totalVotes;
	okayPercent = (reposterObject.okays).length / totalVotes;
	dislikePercent = (reposterObject.dislikes).length / totalVotes;

	likePercent = (likePercent * 100).toFixed();
	likePercent = likePercent + '%';

	dislikePercent = (dislikePercent * 100).toFixed();
	dislikePercent = dislikePercent + '%';

	okayPercent = (okayPercent * 100).toFixed();
	okayPercent = okayPercent + '%';
}

function constructResponse(action) {
	var response = {
		song: currentSong,
		profile: profile,
		reposter: reposter,
		likePercent: likePercent,
		dislikePercent: dislikePercent,
		okayPercent: okayPercent,
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
					totalOkays: 0,
					totalDislikes: 0,
					likes: [],
					dislikes: [],
					okays: [],
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
	} else if (request.subject === 'okaySong') {
		reposterObject.totalOkays++;

		var today = new Date().toJSON();

		reposterObject.okays.push({
			profile: profile,
			song: currentSong,
			date: today
		});

		var object = {};
		object[reposter] = reposterObject;

		chrome.storage.sync.set(object, function() {
			updatePercent();
			sendResponse(constructResponse('Okayd and saved!'));
		});

		return true;
	}
	return false;
});
