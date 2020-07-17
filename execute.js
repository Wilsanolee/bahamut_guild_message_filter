// retrieves user data
function load(){
	
	chrome.storage.sync.get({
		isSearchFilter: false,
		isBlackFilter: false,
		isFilterClosing: false,
		isAutoClosePic: false,
		hasForbiddenWordsFilterOpened: false,
		searchListing: [],
		blackListing: [],
		forbiddenWordsListing: [],
	}, function(items) {
		isSearchFilter = items.isSearchFilter;
		isBlackFilter = items.isBlackFilter;
		isFilterClosing = items.isFilterClosing;
		isAutoClosePic = items.isAutoClosePic;
		hasForbiddenWordsFilterOpened = items.hasForbiddenWordsFilterOpened;
		
		filterAccounts = isSearchFilter ? items.searchListing : items.blackListing;
		forbiddenWordsListing = items.forbiddenWordsListing;
	});
}

// fires when the UI button (id: moreBtn) in popup.html page is clicked
function readmore(){
	document.getElementById("moreBtn").click();
}

// fires automatically or the UI button (id: filter) in popup.html page is clicked
function filtering(){
	
	load();
	setTimeout(function() {
		filter("MSG-box2", 0);
		filter("readMore", 0);
	}, 200);
}

// fires when "filtering" or "readMoreEvent" is called 
function filter(id, startIndex) {
	
	var dialogs = document.getElementById(id);
	var children = dialogs.childNodes;
	var div1Paras = dialogs.getElementsByClassName("MSG-box2");
	var num = div1Paras.length;
	if (num == 0) return;
	
	var remove_list = [];
	for (var i = startIndex; i < num; i++) {
		if (children[i].firstElementChild.hasAttribute("href") == false)	continue;
		
		var url = children[i].firstElementChild.getAttribute("href");
		var account = url.substring(41, url.length);	// the index of character '=' in url is 40
		var isInList = false;
		
		// isSearchFilter or isBlackFilter
		if(isFilterClosing == false){
			for(var j=0; j<filterAccounts.length; j++){
				isInList = isInList || (filterAccounts[j] == account);
			}
			
			if(isInList && isBlackFilter) {
				remove_list.push(i);
			}
			else if(!isInList && isSearchFilter) {
				remove_list.push(i);
			}
		}
		
		if(hasForbiddenWordsFilterOpened && contentChecker(div1Paras[i].getElementsByClassName("msgright"))){
			if(remove_list.includes(i) == false)
				remove_list.push(i);
		}
	}
	
	if(id == "readMore")
		lastID = num-remove_list.length;
	
	for (var j = 0; j < remove_list.length; j++) {
		div1Paras[0].parentNode.removeChild(div1Paras[remove_list[j] - j]);
	}
	
	if(isAutoClosePic == false)	return;
	for(var j=0; j<div1Paras.length; j++){
		autoPictureClosing(div1Paras[j].getElementsByClassName("msgright"));
	}
}

// ========================================================================================
// returns true if div has word which is among 'forbiddenWordsListing'
function contentChecker(div){
	
	// filters by the content
	var nodes = div.item(0).childNodes;
	var isContent = false;
	var content = "";
	for(var i=0; i<nodes.length; i++){
		
		var obj = nodes[i];
		if(obj.className === "msgitembar")	break;
		
		if(isContent){
			content += (obj.textContent ? obj.textContent : obj.innerText);
		}
		
		if(obj.className === "msgname AT1")	isContent = true;
	}
	
	for(var i=0; i<forbiddenWordsListing.length; i++){
		if(content.includes(forbiddenWordsListing[i]))
			return true;
	}
	return false;
}

// fires at the end of "filter" and the variable isAutoClosePic must be true
function autoPictureClosing(div){
	
	var els = div.item(0).getElementsByTagName('a');
	for(var i=0; i<els.length; i++){
		if(els[i].hasAttribute("href")){
			var str = String(els[i].getAttribute("href"));
			var len = str.length;
			str = str.substring(len-4, len).toLowerCase();
			
			if(str === ".jpg" || str === ".png" || str == "jpeg" || str == ".gif"){
				els[i].innerText = "[自動關圖]";
				
				// recovery
				// var ch = els[i].childNodes[0];
				// els[i].innerText = "";
				// els[i].appendChild(ch);
			}
		}
	}
}

// controls the display style
function update_page(){
	
	chrome.storage.sync.get({
		hide_intro: false,
		hide_announcement: false,
		hide_management: false,
	}, function(items) {
		if(items.hide_intro){
			document.getElementsByClassName("GU-lbox2A")[0].style.display = "none";
		}
		if(items.hide_announcement){
			document.getElementsByClassName("BH-rbox GU-rbox1")[0].style.display = "none";
		}
		if(items.hide_management){
			document.getElementsByClassName("BH-rbox GU-rbox2")[0].style.display = "none";
		}
	});
}

// gives GP or BP automatically
// 		id : element id
//		className : class name
// 		str = "推" or "噓"
function giveGPBP_all(id, className, str){
	
	var els = document.getElementById(id).getElementsByClassName(className);
	Array.prototype.forEach.call(els, function(el) {
		var label = el.getElementsByTagName('a');
		if(typeof label[0] != "undefined" && label[0].text == str){
			window.location = label[0].href;
		}
	});
}

// fires when the value of three checkboxes in popup.html page is changed
function hiding(index) {
	
	var block = document.getElementsByClassName("GU-lbox2A");
	switch(index){
		case 0:
			block = document.getElementsByClassName("GU-lbox2A");
			break;
			
		case 1:
			block = document.getElementsByClassName("BH-rbox GU-rbox1");
			break;
			
		case 2:
			block = document.getElementsByClassName("BH-rbox GU-rbox2");
			break;
			
		default:
			return;
	}
	
	block[0].style.display = (block[0].style.display != "none") ? "none" : "block";
	
	chrome.storage.sync.set({
		hide_intro: document.getElementsByClassName("GU-lbox2A")[0].style.display == "none",
		hide_announcement: document.getElementsByClassName("BH-rbox GU-rbox1")[0].style.display == "none",
		hide_management: document.getElementsByClassName("BH-rbox GU-rbox2")[0].style.display == "none",
	});
}

const onMessage = (message) => {
	
	switch (message.action) {
		case 'FILTER':
			lastID = 0;
			filtering();
			break;
			
		case 'READMORE':
			readmore();
			break;
			
		case 'GOOD':
			giveGPBP_all("MSG-box2", "msggood ST1", "推");
			giveGPBP_all("readMore", "msggood ST1", "推");
			break;
			
		case 'BAD':
			giveGPBP_all("MSG-box2", "msgbed ST1", "噓");
			giveGPBP_all("readMore", "msgbed ST1", "噓");
			break;
		
		case 'HIDDEN_INTRO':
			hiding(0);
			break;
		
		case 'HIDDEN_ANNOUNCEMENT':
			hiding(1);
			break;
		
		case 'HIDDEN_LIST':
			hiding(2);
			break;
		default:
			break;
	}
}

// fires when the UI button (id: moreBtn) in either popup.html or current page is clicked
function readMoreEvent() {
	
	load();
	setTimeout(function() {
		filter("readMore", lastID);
	}, 500);
}

// =====================================================
// variable initialization
var lastID = 0;
var filterAccounts = [];
var forbiddenWordsListing = [];
var isSearchFilter = false;
var isBlackFilter = false;
var isFilterClosing = false;
var isAutoClosePic = false;
var hasForbiddenWordsFilterOpened = false;
chrome.runtime.onMessage.addListener(onMessage);

load();				// retrieves user data
update_page();
setTimeout(function() {
	filtering();	// filters automatically
}, 200);
document.getElementById("moreBtn").addEventListener("click", readMoreEvent, false);