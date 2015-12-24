function setChildTextNode(elementId, text) {
	document.getElementById(elementId).innerText = text;
}

chrome.runtime.sendMessage( {'subject': 'getCurrentSong'}, function(response) {
	setChildTextNode('current-song', response.song);
	setChildTextNode('profile', response.profile);
	setChildTextNode('reposted-by', response.reposter);
	setChildTextNode('action', response.action);
	setChildTextNode('like-percent', response.likePercent);
	setChildTextNode('okay-percent', response.okayPercent);
	setChildTextNode('dislike-percent', response.dislikePercent);
});

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('like').addEventListener('click', likeSong);
	document.getElementById('okay').addEventListener('click', okaySong);
	document.getElementById('dislike').addEventListener('click', dislikeSong);
});

function likeSong() {
	chrome.runtime.sendMessage( {'subject': 'likeSong'}, function(response) {
		setChildTextNode('action', response.action);
		setChildTextNode('like-percent', response.likePercent);
		setChildTextNode('okay-percent', response.okayPercent);
		setChildTextNode('dislike-percent', response.dislikePercent);
	});
}

function dislikeSong() {
	chrome.runtime.sendMessage( {'subject': 'dislikeSong'}, function(response) {
		setChildTextNode('action', response.action);
		setChildTextNode('like-percent', response.likePercent);
		setChildTextNode('okay-percent', response.okayPercent);
		setChildTextNode('dislike-percent', response.dislikePercent);
	});
}

function okaySong() {
	chrome.runtime.sendMessage( {'subject': 'okaySong'}, function(response) {
		setChildTextNode('action', response.action);
		setChildTextNode('like-percent', response.likePercent);
		setChildTextNode('okay-percent', response.okayPercent);
		setChildTextNode('dislike-percent', response.dislikePercent);
	});
}
