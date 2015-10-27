MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var initialTarget = document.querySelector('.playControls__soundBadge');
var initialObserver = new MutationObserver(function(mutations, observer) {
	var currentSongTarget = document.querySelector('.playbackSoundBadge__title');

	if (currentSongTarget) {
		console.log(currentSongTarget.getAttribute('href'));

		var songLink = currentSongTarget.getAttribute('href');

		// Remove first /
		songLink = songLink.substr(1);
		songLink = songLink.split('/');

		chrome.runtime.sendMessage(
			{
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
