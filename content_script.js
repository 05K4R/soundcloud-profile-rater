MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var initialTarget = document.querySelector('.playControls__soundBadge');
var initialObserver = new MutationObserver(function(mutations, observer) {
	var currentSongTarget = document.querySelector('.playbackSoundBadge__title');

	if (currentSongTarget) {
		var songLink = currentSongTarget.getAttribute('href');

		// songLink is formatted as /[profile]/[song]
		songLink = songLink.substr(1); // strip leading /
		songLink = songLink.split('/'); // place [profile] in songLink[0] and [song] in songLink[1]

		chrome.runtime.sendMessage(
			{
				subject: 'updateSong',
				profile: songLink[0],
				song: songLink[1]
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
