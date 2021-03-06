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
    ajax_call ( "cgi/rssfwdapi.php?cmd=addSubscription&email=" + email + "&link=" + link + "&name=" + rssname , null, onAddSubFinished );
    email.value = "";
    link.value = "";
    rssname.value = "";
}

function onAddSubFinished ( lst ) {
    alert ("onAddSubFinished") ;
    ajax_call ( "cgi/rssfwdapi.php?cmd=getSubscriptionList", null, relayout_sublist );
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
		ajax_call ( "cgi/rssfwdapi.php?cmd=removeSubscription&link="+urlencode(link.getAttribute('href')), null, onRemoveSubFinished );
		doAction = true;		
	    }
	}
    }
}

function onRemoveSubFinished ( lst ) {
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
    const SUCCESS = 0;
    const FAILED = 1;
    var stitle = "succeeded : \n";
    var ftitle = "failed : \n";
    for ( var i=0; i<lst[SUCCESS].length; i++ ) {
	stitle += lst[SUCCESS][i];
	stitle += "\n";
    }
    for ( i=0; i<lst[FAILED].length; i++ ) {
	ftitle += lst[FAILED][i];
	ftitle += "\n";
    }
    alert ( stitle + "\n" + ftitle );
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
