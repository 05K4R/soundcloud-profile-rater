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
	console.log(reposterObject);
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

		var reposter = getUpdatedReposter(profile, currentSong, reposterObject.likes);

		chrome.storage.sync.set(reposter, function() {
			updatePercent();
			sendResponse(constructResponse('Liked and saved!'));
		});

		return true;
	} else if (request.subject === 'dislikeSong') {
		reposterObject.totalDislikes++;

		var reposter = getUpdatedReposter(profile, currentSong, reposterObject.dislikes);

		chrome.storage.sync.set(reposter, function() {
			updatePercent();
			sendResponse(constructResponse('Disliked and saved!'));
		});

		return true;
	} else if (request.subject === 'okaySong') {
		reposterObject.totalOkays++;

		var reposter = getUpdatedReposter(profile, currentSong, reposterObject.okays);

		chrome.storage.sync.set(reposter, function() {
			updatePercent();
			sendResponse(constructResponse('Okayd and saved!'));
		});

		return true;
	}
	return false;
});

function getUpdatedReposter(profile, song, array) {
	var today = new Date().toJSON();

	var alreadyRated = false;

	removeSong(profile, song, reposterObject.likes);
	removeSong(profile, song, reposterObject.dislikes);
	removeSong(profile, song, reposterObject.okays);

	array.push({
		profile: profile,
		song: song,
		date: today
	});

	var object = {};
	object[reposter] = reposterObject;

	return object;
}

function removeSong(profile, song, array) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].song === song && array[i].profile === profile) {
			array.splice(i, 1);
		}
	}
}

// Following snippet borrowed from Google's Chrome Extension examples
// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
	// Replace all rules ...
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		// With a new rule ...
		chrome.declarativeContent.onPageChanged.addRules([
			{
				// That fires when a page's URL contains 'soundcloud.com/stream' ...
				conditions: [
					new chrome.declarativeContent.PageStateMatcher({
						pageUrl: { urlContains: 'soundcloud.com/stream' },
					})
				],
				// And shows the extension's page action.
				actions: [ new chrome.declarativeContent.ShowPageAction() ]
			}
		]);
	});
});
