var rssfwdfox = {
    interval : 300000,
    onLoad: function() {
	// initialization code
	this.initialized = true;
	this.strings = document.getElementById("rssfwdfox-strings");
    },

    updateRss : function () {
	new Ajax.Request('http://mweiguo.heliohost.org/rssfwd/rssfwdapi.php?cmd=fowardAllNewFeeds',
			 {
			     method:'get',
			     onSuccess: function(transport){
				 var response = transport.responseText || "no response text";
//				 alert ( response );
			     },
			     onFailure: function(){ alert('Something went wrong...'); }
			 });
    },

    onOpenPreference: function(e) {
	window.open("chrome://rssfwdfox/content/rssfwdpref.xul", "win name", "chrome,width=400,height=380,centerscreen=yes");
    }
};

window.addEventListener("load", function(e) { rssfwdfox.onLoad(e); }, false);
setInterval ( rssfwdfox.updateRss, rssfwdfox.interval );
//window.onload = function () {
//};
