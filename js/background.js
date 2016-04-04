const PROFILE_PREFIX = 'profile_';

var categories = [
    {
        id: 1,
        name: 'Like'
    },
    {
        id: 2,
        name: 'Dislike'
    },
    {
        id: 3,
        name: 'Okay'
    }
];
var labels = [
    {
        id: 1,
        name: 'Mix'
    },
    {
        id: 2,
        name: 'Original'
    },
    {
        id: 3,
        name: 'Remix'
    }
];

var currentTrack; // { name: String, uploader: String, date: String? }
var profileName; // String
var profileData; // { |categoryId|: [{name: String, uploader: String, dates: [String?], labels: [int]} ] }

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.subject === 'newCurrentTrack') {
        currentTrack = {
            name: request.name,
            uploader: request.uploader,
            date: request.date
        }
        profileName = request.profile;

        updateProfileData(profileName);
        sendResponse();
        return true;
    } else if (request.subject === 'getCurrentTrack') {
        sendResponse({ track: currentTrack });
    } else if (request.subject === 'getProfileName') {
        sendResponse({ profile: profileName });
    } else if (request.subject === 'getCategories') {
        sendResponse({ categories: categories });
    } else if (request.subject === 'getLabels') {
        sendResponse({ labels: labels });
    } else if (request.subject === 'getCurrentTrackCategory') {
        var categoryId = getTrackCategory(currentTrack);
        sendResponse({ categoryId: categoryId });
    } else if (request.subject === 'getCurrentTrackLabels') {
        var labelIds = getTrackLabels(currentTrack);
        sendResponse({ labelIds: labelIds });
    } else if (request.subject === 'getTotalCategorizedTracks') {
        var amount = getTotalCategorizedTracks();
        sendResponse({ amount: amount });
    } else if (request.subject === 'getPercentReposts') {
        var reposts = getTotalReposts();
        var totalTracks = getTotalPosts();
        percent = (totalTracks != 0 ? reposts / totalTracks : 0) * 100;
        sendResponse({ percent: percent });
    } else if (request.subject === 'getCategoryPercents') {
        var percents = getCategoryPercents();
        sendResponse({ percents: percents });
    } else if (request.subject === 'getLabelPercents') {
        var percents = getLabelPercents();
        sendResponse({ percents: percents });
    } else if (request.subject === 'setCurrentTrackCategory') {
        var track;
        if  (trackHasCategory(currentTrack)) {
            track = getTrack(currentTrack);
            deleteTrack(currentTrack);
        } else {
            track = {
                name: currentTrack.name,
                uploader: currentTrack.uploader,
                dates: [],
                labels: []
            }
        }
        if (!arrayContains(track.dates, currentTrack.date)) {
            track.dates.push(currentTrack.date);
        }
        if (!profileData[request.categoryId]) {
            profileData[request.categoryId] = [];
        }
        profileData[request.categoryId].push(track);
        saveProfile(profileName);
        sendResponse();
        return true;
    } else if (request.subject === 'addCurrentTrackLabel') {
        if (!trackHasCategory(currentTrack)) {
            sendResponse('ERROR: track does not have a category');
        }
        var track = getTrack(currentTrack);
        if (arrayContains(track.labels, request.labelId)) {
            sendResponse('ERROR: label already added to track');
        }
        track.labels.push(request.labelId);
        saveProfile(profileName);
        sendResponse();
        return true;
    } else if (request.subject === 'removeCurrentTrackLabel') {
        if (!trackHasCategory(currentTrack)) {
            sendResponse('ERROR: track does not have a category');
        }
        var track = getTrack(currentTrack);
        if (!arrayContains(track.labels, request.labelId)) {
            sendResponse('ERROR: label is not on track');
        }
        var index = track.labels.indexOf(request.labelId);
        if (index > -1) {
            track.labels.splice(index, 1);
        }
        saveProfile(profileName);
        sendResponse();
        return true;
    }
});

function getLabelPercents() {
    var total = getTotalCategorizedTracks();
    var percents = [];
    labels.forEach(function(label) {
        count = 0;
        categories.forEach(function(category) {
            if (profileData[category.id]) {
                profileData[category.id].forEach(function(track) {
                    if (arrayContains(track.labels, label.id)) {
                        count += 1;
                    }
                });
            }
        });
        percents.push({
            id: label.id,
            name: label.name,
            percent: total ? count / total * 100 : 0
        });
    });
    return percents;
}

function getCategoryPercents() {
    var total = getTotalCategorizedTracks();
    var percents = [];
    categories.forEach(function(category) {
        if (profileData[category.id]) {
            var tracks = profileData[category.id].length;
            percents.push({
                id: category.id,
                name: category.name,
                percent: tracks / total * 100
            });
        } else {
            percents.push({
                id: category.id,
                name: category.name,
                percent: 0
            });
        }
    });
    return percents;
}

function getTotalPosts() {
    return getTotalReposts() + getTotalCategorizedTracks();
}

function getTotalReposts() {
    var reposts = 0;
    tracks = getAllCategorizedTracks();
    tracks.forEach(function(track) {
        reposts += track.dates.length - 1;
    });
    return reposts;
}

function getAllCategorizedTracks() {
    tracks = [];
    categories.forEach(function(category) {
        if (profileData[category.id]) {
            tracks = tracks.concat(profileData[category.id]);
        }
    });
    return tracks;
}

function getTotalCategorizedTracks() {
    var amount = 0;
    categories.forEach(function(category) {
        if (profileData[category.id]) {
            amount += profileData[category.id].length;
        }
    })
    return amount;
}

function getTrackCategory(track) {
    var categoryId;
    categories.forEach(function(category) {
        if (profileData[category.id]) {
            profileData[category.id].forEach(function(entry) {
                if (track.name === entry.name && track.uploader === entry.uploader) {
                    categoryId = category.id;
                }
            });
        }
    });
    return categoryId;
}

function getTrackLabels(track) {
    if (trackHasCategory(track)) {
        return getTrack(track).labels;
    }
}

function deleteTrack(track) {
    categories.forEach(function(category) {
        if (profileData[category.id]) {
            for (var i = 0; i < profileData[category.id].length; i++) {
                var entry = profileData[category.id][i];
                if (track.name === entry.name && track.uploader === entry.uploader) {
                    profileData[category.id].splice(i, 1);
                    break;
                }
            }
        }
    });
}

function saveProfile(profileName) {
    profileIdentifier = PROFILE_PREFIX + profileName;
    profile = {};
    profile[profileIdentifier] = profileData;
    chrome.storage.sync.set(profile, function() {
        console.log("saved");
    });
}

function trackHasCategory(track) {
    if (getTrack(track)) {
        return true;
    } else {
        return false;
    }
}

function getTrack(track) {
    var foundEntry;
    categories.forEach(function(category) {
        if (profileData[category.id]) {
            profileData[category.id].forEach(function(entry) {
                if (track.name === entry.name && track.uploader === entry.uploader) {
                    foundEntry = entry;
                }
            });
        }
    });
    return foundEntry;
}

function updateProfileData(profileName) {
    profileIdentifier = PROFILE_PREFIX + profileName;

    chrome.storage.sync.get(profileIdentifier, function(item) {
        if (Object.keys(item).length !== 0 || JSON.stringify(item) !== JSON.stringify({})) {
            profileData = item[profileIdentifier];
        } else {
            profileData = {};
        }
    });
}

function arrayContains(array, value) {
    return array.indexOf(value) > -1;
}
