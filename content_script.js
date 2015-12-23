MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var initialTarget = document.querySelector('.playControls__soundBadge');
var initialObserver = new MutationObserver(function(mutations, observer) {
	var currentSongTarget = document.querySelector('.playbackSoundBadge__title');

	if (currentSongTarget) {
		var songInfo = getSongInfo(currentSongTarget.getAttribute('href'));

		chrome.runtime.sendMessage(
			{
				subject: 'updateSong',
				profile: songInfo.profile,
				song: songInfo.song,
				reposter: songInfo.reposter
			},
			function(response) {
				console.log('Response: ' + response);
			}
		);
	}
});

initialObserver.observe(initialTarget, {
  subtree: true,
  childList: true
});

function getSongInfo(songLink) {
	// songLink is formatted as /[profile]/[song]
	var song = songLink.substr(1); // strip leading /
	song = song.split('/'); // place [profile] in song[0] and [song] in song[1]

	var streamSongs = document.querySelectorAll('.streamContext');

	var reposter;

	for (var i = 0; i < streamSongs.length; i++) {
		var item = streamSongs[i];

		var title = item.querySelector('.soundTitle__title');

		// if the current playing song is found, take the reposter value
		if (title.getAttribute('href') === songLink) {
			reposter = item.querySelector('.soundContext__usernameLink').getAttribute('href');
			reposter = reposter.substr(1);
			break;
		}
	}

	return {
		song: song[1],
		profile: song[0],
		reposter: reposter
	}
}
