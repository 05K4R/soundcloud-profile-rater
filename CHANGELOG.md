# Change Log
A change log for (hopefully) all changes made to this program. Categorizing and/or labeling a track is referred to as rating a track in this document.

## [Unreleased]
### Added
- Add ability to rate songs on profile pages.

### Changed
- Change page action to browser action, this enables rating when playing a track in different tab.

### Fixed
- Fix event page persistence.

### Removed
- Remove debug field in the popup.

## 0.1.0 - 2016-03-30
### Added
- Add ability to rate songs in the Soundcloud stream when browsing the stream.
- Add default categories:
    - Like
    - Dislike
    - Okay
- Add default labels:
    - Mix
    - Original
    - Remix
- Add popup to show:
    - Total number of categorized tracks
    - Percent reposts
    - Profile category percentage
    - Profile label percentage
    - Information for debugging
- Save rating information to chrome.storage.sync to sync data across different devices.
