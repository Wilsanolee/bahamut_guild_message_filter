// fires when the initial HTML document has been completely loaded and parsed
function restore_options() {
	
	// retrieves user data by chrome.storage API
	chrome.storage.sync.get({
		searchListing: [],
		blackListing: [],
		forbiddenWordsListing: [],
		isSearchMode: true,
		isBlackMode: false,
		isForbiddenWordsMode: false,
	}, function(items) {
		searchListing = items.searchListing;
		blackListing = items.blackListing;
		forbiddenWordsListing = items.forbiddenWordsListing;
		// updates UI elements
		document.getElementById('checkbox_searchMode').checked = isSearchMode = items.isSearchMode;
		document.getElementById('checkbox_blackMode').checked = isBlackMode = items.isBlackMode;
		document.getElementById('checkbox_forbiddenWordsMode').checked = isForbiddenWordsMode = items.isForbiddenWordsMode;
	});
	
	// shows accounts and forbidden words in the page
	var status = document.getElementById('status');
	setTimeout(function() {
		update_options_page();
	}, 200);
}

// ========================================================================================
// fires when the UI button (id: addToList) in options.html page is clicked
function addToListing(){
	
	const msg = document.getElementById("message").value;
	clear_input();
	
	var tmpList = isSearchMode ? searchListing : ( isBlackMode ? blackListing : forbiddenWordsListing );
	if(msg.length == 0 || tmpList.includes(msg))	return;
	
	// uses regular expression to assure the message is legal
	if(isForbiddenWordsMode == false && msg.match(/^[A-Z,a-z,0-9]+$/) == null)	return;
	tmpList.push(msg);
	
	save_options();
}

// fires when the UI button (id: clear_records) in options.html page is clicked
function clear_records() {
	
	var tmpList = isSearchMode ? searchListing : ( isBlackMode ? blackListing : forbiddenWordsListing );
	tmpList.length = 0;
	
	clear_input();
	save_options();
	update_options_page();
}

// fires when the UI button (id: delete_last) in options.html page is clicked
function delete_last(){
	
	var tmpList = isSearchMode ? searchListing : ( isBlackMode ? blackListing : forbiddenWordsListing );
	tmpList.length = Math.max(0, tmpList.length-1);
	save_options();
	update_options_page();
}

// fires when the UI button (id: clear_input) in options.html page is clicked or "addToListing", "clear_records" is called
function clear_input(){
	document.getElementById("message").value = "";
}

// fires when either "addToListing" or "clear_records" or "delete_last" is called
function save_options() {
	
	// saves user data by chrome.storage API
	chrome.storage.sync.set({
		blackListing: blackListing,
		searchListing: searchListing,
		forbiddenWordsListing: forbiddenWordsListing,
		isSearchMode: isSearchMode,
		isBlackMode: isBlackMode,
		isForbiddenWordsMode: isForbiddenWordsMode,
	}, function() {
		update_options_page();
		
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 500);
	});
}

// fires when either "restore_options" or "clear_records" or "delete_last" or "save_options" is called
function update_options_page() {
	
	refreshListingData(document.getElementById("search_accounts"), searchListing);
	refreshListingData(document.getElementById("black_accounts"), blackListing);
	refreshListingData(document.getElementById("forbidden_words"), forbiddenWordsListing);
}

// fires when "update_options_page" is called
function refreshListingData(els, tmpList){
	
	// removes all accounts in the list
	while(els.firstChild){
		els.removeChild(els.firstChild);
	}
	
	// displays current storage accounts in the page
	tmpList.forEach(function(el){
		var para = document.createElement("p");
		var node = document.createTextNode(el);
		para.appendChild(node);
		els.appendChild(para);
	});
}

// fires when UI elements' (i.e. checkbox) value is changed
function onValueChanged(){
	isSearchMode = document.getElementById('checkbox_searchMode').checked;
	isBlackMode = document.getElementById('checkbox_blackMode').checked;
	isForbiddenWordsMode = document.getElementById('checkbox_forbiddenWordsMode').checked;
	setTimeout(function() {
		save_options();
	}, 100);
}
// ========================================================================================

// variable initialization
var blackListing = [];
var searchListing = [];
var forbiddenWordsListing = [];
var isSearchMode = false;
var isBlackMode = false;
var isForbiddenWordsMode = false;

// adds event listener to UI elements
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('addToList').addEventListener('click', addToListing);
document.getElementById('clear_input').addEventListener('click', clear_input);
document.getElementById('delete_last').addEventListener('click', delete_last);
document.getElementById('clear_records').addEventListener('click', clear_records);
document.getElementById('checkbox_searchMode').addEventListener('change', onValueChanged);
document.getElementById('checkbox_blackMode').addEventListener('change', onValueChanged);
document.getElementById('checkbox_forbiddenWordsMode').addEventListener('change', onValueChanged);