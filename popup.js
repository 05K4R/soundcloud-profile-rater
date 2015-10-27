function setChildTextNode(elementId, text) {
	document.getElementById(elementId).innerText = text;
}

chrome.runtime.sendMessage( {'subject': 'getCurrentSong'}, function(response) {
	setChildTextNode('current-song', response.song);

	setChildTextNode('profile', response.profile);
});
