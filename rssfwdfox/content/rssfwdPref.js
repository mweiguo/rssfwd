function onItemSelected() {
    var selectedItem = document.getElementById("rsslist").selectedItem;
    document.getElementById("titlebox").value = selectedItem.childNodes[0].getAttribute("label");
    document.getElementById("emailbox").value = selectedItem.childNodes[1].getAttribute("label");
    document.getElementById("rssbox").value = selectedItem.childNodes[2].getAttribute("label");
}

function onChangeItem () {
    changeItem (
	document.getElementById("rsslist").selectedItem.childNodes[2].getAttribute("label"),
	document.getElementById("titlebox").value,
	document.getElementById("emailbox").value,
	document.getElementById("rssbox").value
    );
}

function changeItemUI ( title, email, rss ) {
    document.getElementById("rsslist").selectedItem.childNodes[0].setAttribute("label", title );
    document.getElementById("rsslist").selectedItem.childNodes[1].setAttribute("label", email );
    document.getElementById("rsslist").selectedItem.childNodes[2].setAttribute("label", rss );
}

function changeItem ( oldrss, title, email, rss ) {
    var baseurl = 'http://mweiguo.heliohost.org/rssfwd/rssfwdapi.php?cmd=modifySubscription';
    var para = '&name=' + title;
    para += '&email=' + email;
    para += '&link=' + encodeURIComponent(rss);
    para += '&oldlink=' + encodeURIComponent(oldrss);
    new Ajax.Request( baseurl + para,
		      {
			  method:'get',
			  onSuccess: function(transport){
			      var response = transport.responseText || "no response text";
			      if ( response == "success" ) {
				  changeItemUI ( title, email, rss );
				  clearInputbox();
			      } else {
				  alert("falied: " + response);
			      }
			  },
			  onFailure: function(){ alert('Something went wrong...'); }
		      });
}

function clearInputbox() {
    document.getElementById("titlebox").value = "";
    document.getElementById("emailbox").value = "";
    document.getElementById("rssbox").value = "";
}

function addItem ( title, email, rss ) {
    var baseurl = 'http://mweiguo.heliohost.org/rssfwd/rssfwdapi.php?cmd=addSubscription';
    var para = '&name=' + title;
    para += '&email=' + email;
    para += '&link=' + encodeURIComponent(rss);
    new Ajax.Request( baseurl + para,
		      {
			  method:'get',
			  onSuccess: function(transport) {
			      var response = transport.responseText || "no response text";
			      if ( response == "success" ) {
				  addItemUI ( title, email, rss );
				  clearInputbox();
			      } else {
				  alert("添加失败");
			      }
			  },
			  onFailure: function(){ alert('Something went wrong...'); }
		      });    
}

function addItemUI ( title, email, rss ) {
    var listItem = document.createElement("listitem");
    var titleCell = document.createElement("listcell");
    var emailCell = document.createElement("listcell");
    var rssCell = document.createElement("listcell");

    listItem.appendChild ( titleCell );
    listItem.appendChild ( emailCell );
    listItem.appendChild ( rssCell );

    titleCell.setAttribute ( "label", title );
    emailCell.setAttribute( "label", email );
    rssCell.setAttribute ( "label", rss );

    document.getElementById("rsslist").appendChild ( listItem );
    
}

function onAddItem () {
    var title = document.getElementById("titlebox").value;
    var email = document.getElementById("emailbox").value;
    var rss = document.getElementById("rssbox").value;
    if ( title=="" && email=="" && rss=="" )
	return;
    addItem ( title, email, rss );
}

function removeSelectedItem () {
    var item = document.getElementById("rsslist").selectedItem;
    var baseurl = 'http://mweiguo.heliohost.org/rssfwd/rssfwdapi.php?cmd=removeSubscription';
    var para = '&link=' + encodeURIComponent( item.childNodes[2].getAttribute("label") );
    new Ajax.Request( baseurl + para,
		      {
			  method:'get',
			  onSuccess: function(transport){
			      var response = transport.responseText || "no response text";
			      if ( response == "success" ) {
				  removeSelectedItemUI();
			      } else {
				  alert("falied: " + response);
			      }
			  },
			  onFailure: function(){ alert('Something went wrong...'); }
		      });

}

function removeSelectedItemUI () {
    var item = document.getElementById("rsslist").selectedItem;
    if ( item != null ) {
	document.getElementById("rsslist").removeChild ( item );
	clearInputbox();
    }
}

function onSaveClose () {
    window.close();
}

function onClose () {
    window.close();
}

window.onload = function () {
    document.getElementById("rsslist").addEventListener ( "select", onItemSelected, false );
    document.getElementById("btnAdd").addEventListener ( "command", onAddItem, false );
    document.getElementById("btnDel").addEventListener ( "command", removeSelectedItem, false );
    document.getElementById("btnChg").addEventListener ( "command", onChangeItem, false );
    document.getElementById("btnClose").addEventListener ( "command", onClose, false );

    new Ajax.Request('http://mweiguo.heliohost.org/rssfwd/rssfwdapi.php?cmd=getSubscriptionList',
		     {
			 method:'get',
			 onSuccess: function(transport){
			     var response = transport.responseText || "no response text";
			     if ( response == "no response text" ) return;
			     eval ( "var t = " + response );
			     for ( var i=0; i<t.length; i++ )
				 addItemUI ( t[i].name, t[i].email, t[i].link );
			 },
			 onFailure: function(){ alert('Something went wrong...'); }
		     });

};