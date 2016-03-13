function setChildTextNode(elementId, text) {
	document.getElementById(elementId).innerText = text;
}

chrome.runtime.sendMessage( {'subject': 'getCurrentTrack'}, function(response) {
	setChildTextNode('info', JSON.stringify(response));
});

// Setup category buttons
chrome.runtime.sendMessage({'subject': 'getCategories'}, function(response) {
	var categories = response.categories;

	categories.forEach(function(category) {

		console.log(category.id);
		console.log(category.name);

		var element = document.createElement('input');
	    element.type = 'button';
	    element.value = category.name;
	    element.name = category.id;
	    element.onclick = function() {
			chrome.runtime.sendMessage({
				'subject': 'setCurrentTrackCategory',
				'categoryId': category.id
			}, function(response) {
				setChildTextNode('info', JSON.stringify(response));
			});
		};

		document.getElementById('category-buttons').appendChild(element);
	});
});
