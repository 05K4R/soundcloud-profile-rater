var elements = document.getElementsByClassName("soundTitle__title");
console.log(elements.length);
// playbackSoundBadge__title


MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var initialTarget = document.querySelector(".playControls__soundBadge");
var initialObserver = new MutationObserver(function(mutations, observer) {
	var currentSongTarget = document.querySelector(".playbackSoundBadge__title");

	if (currentSongTarget) {
		console.log(currentSongTarget.getAttribute("href"));
	}
});

initialObserver.observe(initialTarget, {
  subtree: true,
  childList: true
});
