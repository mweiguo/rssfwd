function relayout_sublist ( lst ) {
    var sublist = document.getElementById ('sublist');
    if ( sublist ) {
	var tmp = "<tr><td></td><td>E-mail</td><td>link</td></tr>";
	for ( var i=0 in lst ) {
	    var link = lst[i]['link'].replace(/&/g, "&amp;");
	    var name = lst[i]['name'];
	    tmp += "<tr><td><input type='checkbox'/></td><td>" + lst[i]['email'] +
		"</td><td><a href=" + link + ">" + name + "</a></td></tr>";
	}
	sublist.innerHTML = tmp;
    }
}

function addSubscription () {
    var email = document.getElementById ( "emaileditor" ).value;
    var link   = document.getElementById ( "rsseditor" ).value;
    var rssname   = document.getElementById ( "rssnameeditor" ).value;
    link = urlencode ( link );
    ajax_call ( "cgi/rssfwdapi.php?cmd=addSubscription&email=" + email + "&link=" + link + "&name=" + rssname , null, null );
    ajax_call ( "cgi/rssfwdapi.php?cmd=getSubscriptionList", null, relayout_sublist );
    email.value = "";
    link.value = "";
    rssname.value = "";
 }

function removeCheckedSubs () {
    var tbl = document.getElementById ( 'sublist' );
    var rows = tbl.rows;
    var doAction = false;
    for ( var i=0; i<rows.length; i++ ) {
	var checkbox = rows[i].cells[0].childNodes[0];
	if ( checkbox && checkbox.checked ) {
	    var link = rows[i].cells[2].childNodes[0];
	    if ( link ) {
		ajax_call ( "cgi/rssfwdapi.php?cmd=removeSubscription&link="+urlencode(link.getAttribute('href')), null, null );
		doAction = true;		
	    }
	}
    }

    if ( doAction )
	ajax_call ( "cgi/rssfwdapi.php?cmd=getSubscriptionList", null, relayout_sublist );
}

function forwardCheckedSubs () {
    var tbl = document.getElementById ( 'sublist' );
    var rows = tbl.rows;
    var doAction = false;
    for ( var i=0; i<rows.length; i++ ) {
	var checkbox = rows[i].cells[0].childNodes[0];
	if ( checkbox && checkbox.checked ) {
	    var link = rows[i].cells[2].childNodes[0];
	    if ( link ) {
		ajax_call ( "cgi/rssfwdapi.php?cmd=fowardNewRssFeeds&link="+urlencode(link.getAttribute('href')), null, showFwdResult );
		doAction = true;		
	    }
	}
    }

    if ( doAction )
	ajax_call ( "cgi/rssfwdapi.php?cmd=getSubscriptionList", null, relayout_sublist );
}

function showFwdResult ( lst ) {
    if ( lst.error==0  ) {
	alert ( "succeeded: " + lst.succeeded );
	alert ( "failed: " + lst.failed );
    } else {
	alert ( "error: " + lst.message );
    }
}

window.onload = function () {
/*
    inputemail = new previeweditor ( "emaileditor", "emaildetail", "emailpreview");
    inputrss = new previeweditor ( "rsseditor",   "rssdetail",   "rsspreview");
    inputrssname  = new previeweditor ( "rssnameeditor",   "rssnamedetail",   "rssnamepreview");
 */
    ajax_call ( "cgi/rssfwdapi.php?cmd=getSubscriptionList", null, relayout_sublist );
    document.getElementById ( "btnAdd" ).onclick = addSubscription;
    document.getElementById ( "btnRemove" ).onclick = removeCheckedSubs;
    document.getElementById ( "btnForwardFeeds" ).onclick = forwardCheckedSubs;
};
