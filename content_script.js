MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var initialTarget = document.querySelector('.playControls__soundBadge');
var initialObserver = new MutationObserver(function(mutations, observer) {
	var currentTrackTarget = document.querySelector('.playbackSoundBadge__title');
	if (currentTrackTarget) {
		var trackInfo = getTrackInfo(currentTrackTarget.getAttribute('href'));

		chrome.runtime.sendMessage(
			{
				subject: 'newCurrentTrack',
				name: trackInfo.name,
				uploader: trackInfo.uploader,
				date: trackInfo.date,
				profile: trackInfo.profile
			},
			function(response) {}
		);
	}
});

initialObserver.observe(initialTarget, {
  subtree: true,
  childList: true
});

function getTrackInfo(trackLink) {
	// trackLink is formatted as /[uploader]/[track_name]
	var track = trackLink.substr(1); // strip leading /
	track = track.split('/'); // place [uploader] in track[0] and [track_name] in track[1]

	// if the song is in a playlist (formatted as [track_name]?[playlist_name]),
	// remove the '?' and everything after
	var index = track[1].indexOf('?');
	track[1] = track[1].substring(0, index != -1 ? index : track[1].length);

	var allStreamTracks = document.querySelectorAll('.soundList__item');
	var profile;
	var date;

	for (var i = 0; i < allStreamTracks.length; i++) {
		var item = allStreamTracks[i];

		var title = item.querySelector('.soundTitle__title');

		// if the current playing song is found, take the reposter value and date
		if (title.getAttribute('href') === trackLink) {

			// if the user is on the stream: get the relevant user
			// otherwise: assume that the text after the hostname is the current profile
			if (window.location.pathname.startsWith('/stream')) {
				profile = item.querySelector('.soundContext__usernameLink').getAttribute('href');
			} else {
				profile = window.location.pathname;
			}
			profile = profile.substr(1);
			var slashIndex = profile.indexOf('/');
			profile = profile.substring(0, slashIndex != -1 ? slashIndex : profile.length);

			date = item.querySelector('.relativeTime').getAttribute('datetime');
			break;
		}
	}

	return {
		name: track[1],
		uploader: track[0],
		profile: profile,
		date: date
	}
}
