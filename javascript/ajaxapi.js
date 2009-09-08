function ajax_call ( url, waitfun, finishedfun ) {
    var xmlhttp = _getHttpRequest();
    if ( !xmlhttp ) 
	alert ("null returned");
    _beginCall ( url, xmlhttp, waitfun, finishedfun );
}

function _beginCall( url, xmlhttp, waitfun, finishedfun ) {
    if (xmlhttp.readyState == 4 || xmlhttp.readyState == 0) {
	xmlhttp.open('GET', url, true);
	var callback = _ajaxEventhandler ( xmlhttp, waitfun, finishedfun );
	xmlhttp.onreadystatechange = callback;
	xmlhttp.send ( null );
    }
}

function _getHttpRequest () {
    var xmlhttp = null;
    if ( window.XMLHttpRequest ) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.overrideMimeType ('text/xml');
    } else if ( window.ActiveXObject ) {
	xmlhttp = new ActiveXObject ( "Microsoft.XMLHTTP" );
    }
    return xmlhttp;
}

function _ajaxEventhandler ( xmlhttp, waitfun, finishedfun ) {
    function inner () {
	if (xmlhttp.readyState == 1) {
//	    alert ( "status = 1; " + xmlhttp.status );
	} else if (xmlhttp.readyState == 2) {
	    if ( xmlhttp.status == 200 )
		if ( waitfun ) 
		    waitfun ();
	} else if (xmlhttp.readyState == 3) {
	} else if (xmlhttp.readyState == 4) {
	    if (xmlhttp.status == 200) {
		eval ("var response = (" + xmlhttp.responseText + ")");
		if ( finishedfun ) finishedfun ( response );
	    } else {
		alert('There was a problem with the request.' + xmlhttp.responseText);
	    }
	}
    }
    return inner;
}
