function onValueChanged(){
	chrome.storage.sync.set({
		isSearchFilter: document.getElementById('filter_type_search').checked,
		isBlackFilter: document.getElementById('filter_type_black').checked,
		isFilterClosing: document.getElementById('filter_type_none').checked,
		isAutoClosePic: document.getElementById('autoClosePic').checked,
		hasForbiddenWordsFilterOpened: document.getElementById('filter_type_forbidden').checked,
	});
}

var getSelectedTab = (tab) => {
	var tabId = tab.id;
	var sendMessage = (messageObj) => chrome.tabs.sendMessage(tabId, messageObj);
	
	// sends message
	document.getElementById('filter').addEventListener('click', () => sendMessage({
		action: 'FILTER'
	}));
	document.getElementById('readmore').addEventListener('click', () => sendMessage({
		action: 'READMORE'
	}));
	document.getElementById('good').addEventListener('click', () => sendMessage({
		action: 'GOOD'
	}));
	document.getElementById('bad').addEventListener('click', () => sendMessage({
		action: 'BAD'
	}));
	document.getElementById('hide_intro').addEventListener('change', () => sendMessage({
		action: 'HIDDEN_INTRO'
	}));
	document.getElementById('hide_announcement').addEventListener('change', () => sendMessage({
		action: 'HIDDEN_ANNOUNCEMENT'
	}));
	document.getElementById('hide_management').addEventListener('change', () => sendMessage({
		action: 'HIDDEN_LIST'
	}));
	
	// onValueChange
	document.getElementById('filter_type_search').addEventListener('change', onValueChanged);
	document.getElementById('filter_type_black').addEventListener('change', onValueChanged);
	document.getElementById('filter_type_none').addEventListener('change', onValueChanged);
	document.getElementById('autoClosePic').addEventListener('change', onValueChanged);
	document.getElementById('filter_type_forbidden').addEventListener('change', onValueChanged);
}

chrome.tabs.getSelected(null, getSelectedTab);

// initializes UI elements
chrome.storage.sync.get({
		hide_intro: false,
		hide_announcement: false,
		hide_management: false,
		isSearchFilter: false,
		isBlackFilter: false,
		isFilterClosing: false,
		isAutoClosePic: false,
		hasForbiddenWordsFilterOpened: false
	}, function(items) {
		document.getElementById('hide_intro').checked = items.hide_intro;
		document.getElementById('hide_announcement').checked = items.hide_announcement;
		document.getElementById('hide_management').checked = items.hide_management;
		document.getElementById('filter_type_search').checked = items.isSearchFilter;
		document.getElementById('filter_type_black').checked = items.isBlackFilter;
		document.getElementById('filter_type_none').checked = items.isFilterClosing;
		document.getElementById('autoClosePic').checked = items.isAutoClosePic;
		document.getElementById('filter_type_forbidden').checked = items.hasForbiddenWordsFilterOpened;
});