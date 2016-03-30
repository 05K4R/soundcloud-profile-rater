chrome.runtime.sendMessage({'subject': 'getCategories'}, function(response) {
	setupCategoryButtons(response.categories);
});

chrome.runtime.sendMessage({'subject': 'getLabels'}, function(response) {
	setupLabelButtons(response.labels);
});

chrome.runtime.sendMessage({'subject': 'getCurrentTrackCategory'}, function(response) {
	activateCategoryButton(response.categoryId);
});

chrome.runtime.sendMessage({'subject': 'getCurrentTrackLabels'}, function(response) {
	activateLabelButtons(response.labelIds);
});

updateTextFields();

function updateTextFields() {
	chrome.runtime.sendMessage({'subject': 'getTotalCategorizedTracks'}, function(response) {
		setChildTextNode('total-categorized-tracks', response.amount);
	});

	chrome.runtime.sendMessage({'subject': 'getPercentReposts'}, function(response) {
		setChildTextNode('repost-percent', response.percent + '%');
	});

	chrome.runtime.sendMessage({'subject': 'getCategoryPercents'}, function(response) {
		var string = '';
		response.percents.forEach(function(category) {
			if (string != '') {
				string += ', ';
			}
			string += category.name + ': ' + category.percent + '%';
		});
		setChildTextNode('category-percent', string);
	});

	chrome.runtime.sendMessage({'subject': 'getLabelPercents'}, function(response) {
		var string = '';
		response.percents.forEach(function(label) {
			if (string != '') {
				string += ', ';
			}
			string += label.name + ': ' + label.percent + '%';
		});
		setChildTextNode('label-percent', string);
	});
}

function setChildTextNode(elementId, text) {
	document.getElementById(elementId).innerText = text;
}

function activateLabelButtons(labelIds) {
	if (labelIds) {
		labelIds.forEach(function(labelId) {
			labelButton = document.getElementById('label-' + labelId);
			labelButton.checked = true;
			labelButton.parentNode.className += ' active';
		});
	}
}

function activateCategoryButton(categoryId) {
	categoryButton = document.getElementById('category-' + categoryId);
	if (categoryButton) categoryButton.parentNode.className += ' active';
}

function setupCategoryButtons(categories) {
	categories.forEach(function(category) {
		var categoryElement = document.createElement('label');
		categoryElement.className = 'btn btn-default';
		categoryElement.innerHTML += category.name;

		var element = document.createElement('input');
		element.type = 'radio';
		element.name = 'category';
		element.value = category.id;
		element.id = 'category-' + category.id;
		element.autocomplete = 'off';
		element.onchange = function() {
			chrome.runtime.sendMessage({
				'subject': 'setCurrentTrackCategory',
				'categoryId': category.id
			}, function(response) {
				setChildTextNode('info', JSON.stringify(response));
				updateTextFields();
			});
		};
		categoryElement.appendChild(element);

		document.getElementById('category-buttons').appendChild(categoryElement);
	});
}

function setupLabelButtons(labels) {
	var bootstrapColors = ['info', 'warning', 'success', 'danger', 'primary'];
	var colorCounter = 0;

	labels.forEach(function(label) {
		var labelElement = document.createElement('label');
		labelElement.className = 'btn btn-outline btn-' + bootstrapColors[colorCounter % bootstrapColors.length];
		colorCounter++;

		labelElement.innerHTML += label.name;

		var element = document.createElement('input');
		element.type = 'checkbox';
		element.name = 'label';
		element.value = label.id;
		element.id = 'label-' + label.id;
		element.autocomplete = 'off';
		element.onchange = function() {
			if (element.checked) {
				chrome.runtime.sendMessage({
					'subject': 'addCurrentTrackLabel',
					'labelId': label.id
				}, function(response) {
					setChildTextNode('info', JSON.stringify(response));
					updateTextFields();
				});
			} else {
				chrome.runtime.sendMessage({
					'subject': 'removeCurrentTrackLabel',
					'labelId': label.id
				}, function(response) {
					setChildTextNode('info', JSON.stringify(response));
					updateTextFields();
				});
			}
		};
		labelElement.appendChild(element);

		document.getElementById('label-buttons').appendChild(labelElement);
	});
}
