<?php
require_once "XML/Feed/Parser.php";
require_once "sendmail.php";

class rssFwdSubManager {
  const CFGFILE = "test.xml";
  private $subscriptions;
  private $curfield;
  private $cursubscription;
  private $validfield;
  private $tagendfield;
  private $recordendfield;

  function __construct () {
    $subscriptions = array();

    $this->validfield['subscription'] = true;
    $this->validfield['email']        = true;
    $this->validfield['name']         =	true;
    $this->validfield['link']         =	true;
    $this->validfield['lasttitle']    =	true;
    $this->validfield['lastDesc']     =	true;

    $this->tagendfield['email']        = true;
    $this->tagendfield['name']         = true;
    $this->tagendfield['link']         = true;
    $this->tagendfield['lasttitle']    = true;
    $this->tagendfield['lastDesc']     = true;

    $this->recordendfield['subscription'] = true;

    $xmlsrc = "";
    if ( is_file ( rssFwdSubManager::CFGFILE ) ) {
      $xmlsrc = join ( "", file ( "test.xml" ) );
      $xmlsrc = str_replace ( "&", "&amp;", $xmlsrc );
      $parser = xml_parser_create ();
      xml_set_object ( $parser, &$this );
      xml_set_element_handler ( $parser, "_startelement", "_endelement" );
      xml_set_character_data_handler ( $parser, "_cdata" );
      xml_parse ( $parser, $xmlsrc );
      xml_parser_free ( $parser );
    } else {
      $f = fopen( rssFwdSubManager::CFGFILE, "w+" );
      if ( null == $f )
	echo "can not create configure file";
      fclose ( $f );
    }
  }

  // private section
  function _startelement ( $parser, $element, $inattributes) {
    $element = strtolower ( $element );
    if ( array_key_exists ( $element, $this->validfield ) ) {
      $this->curfield = $element;
/*       echo "$element<br>"; */
    }
  }

  function _endelement ( $parser, $element ) {
    $element = strtolower ( $element );
    if ( array_key_exists ( $element, $this->recordendfield ) ) {
/*       echo "_$element<br>"; */
      $this->subscriptions[] = $this->cursubscription;
      $this->cursubscription = array();
    }
    $this->curfield = '';
  }

  function _cdata ( $parser, $text ) {
    if ( array_key_exists ( $this->curfield, $this->tagendfield ) ) {
      if ( array_key_exists ( $this->curfield, (array)$this->cursubscription ) )
	$this->cursubscription[$this->curfield] .= $text;
      else 
	$this->cursubscription[$this->curfield] = $text;
    }
  }

  function _showtable () {
    foreach ( (array)$this->subscriptions as $subscription ) {
      echo join ( ", ", array_keys ( $subscription )), "\n";
      echo join ( ", ", array_values ( $subscription )), "\n";
    }
  }

  function & _getSubscription ( $l ) {
    for ( $i=0; $i<count($this->subscriptions); $i++ ) {
      if ( !array_key_exists ( 'link', $this->subscriptions[$i]) ) continue;
      if ( $l == $this->subscriptions[$i]['link'] )
	return $this->subscriptions[$i];
    }
    return null;
  }

  // public section
  function save () {
    $xmlsrc = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
    $xmlsrc .= "<root>";
    foreach ( (array)$this->subscriptions as $sub ) {
      $xmlsrc .= "<subscription>";
      foreach ( $sub as $key=>$value )
	$xmlsrc .= "<$key>".$value."</$key>";
      $xmlsrc .= "</subscription>";
    }
    $xmlsrc .= "</root>";

    $f = fopen ( rssFwdSubManager::CFGFILE, "w+" );
    fwrite ( $f, $xmlsrc );
    fclose ( $f );
  }

  function addSubscription ( $e, $n, $l, $t, $d) {
    // check existance
    if ( null == $this->_getSubscription ( $l ) )
      $this->subscriptions[] = array ('email'=>$e, 'name'=>$n, 'link'=>$l, 'lasttitle'=>$t, 'lastdesc'=>$d );
  }

  function deleteSubscription ( $l ) {
    for ( $i=0; $i<count($this->subscriptions); $i++ ) {
      if ( !array_key_exists ( 'link', $this->subscriptions[$i]) ) continue;
      if ( $l == $this->subscriptions[$i]['link'] ) {
	array_splice ( $this->subscriptions, $i, 1 );
	return true;
      }
    }
    return false;
  }

  function getSubsJson () {
    return json_encode ( $this->subscriptions );
  }

  function check ( $l ) {
    $sub = &$this->_getSubscription ( $l );
    if ( $sub == null ) throw new Exception ( "can not find this link in db" );
    if ( !array_key_exists ( 'lasttitle', $sub ) ) 
      $sub['lasttitle'] = '';

    $newentries = array();
    $data = @file_get_contents($sub['link']);
    if ( $data == false ) {
      return $newentries;
    }

    $feed = new XML_Feed_Parser($data);
    foreach ( $feed as $entry ) {
      if ( $entry->title != $sub['lasttitle'] ) {
	$newentries[] = array ('title'=>$entry->title, 'desc'=>$entry->description, 'link'=>$entry->link);
      } else
	break;
    }

    $en = $feed->getEntryByOffset(0);
    $sub['lasttitle'] = $en ? $en->title : $sub['lasttitle'];
    return $newentries;
  }
  
  function fwdnew ( $l ) {
    $sub = &$this->_getSubscription ( $l );
    if ( $sub == null )
      return array('error'=>1, 'message'=>"'$l' is not subscribted");
    if ( !array_key_exists ( 'lasttitle', $sub ) ) 
      $sub['lasttitle'] = '';

    // get content from the link
    $data = @file_get_contents($sub['link']);
    if ( $data == false )
      return array_merge( array('error'=>1), (array)error_get_last() );

    // parse content and get new entries
    $feed = new XML_Feed_Parser($data);
    $newentries = array();
    foreach ( $feed as $en ) {
      // if there have new entry, then forward it
      if ( $en->title != $sub['lasttitle'] ) {
	$newentries[] = $en;
      } else {
	break;
      }
    }

    $sresult = array();
    $fresult = array();
    for ( $i=count($newentries)-1; $i>=0; $i-- ) {
      $en = $newentries[$i];
      $body = "<html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\"></head>".
	"<body><a href=$en->link>".$en->title."</a><br>".$en->desc."</body></html>";
      //      if ( sendhtmlmail_auth ( "mweiguo@hh.com", $sub['email'], $en['title'], $body, "127.0.0.1", "mweiguo@hh.com", "h12345" ) )
      if ( sendhtmlmail_auth ( "c_h3w4@yahoo.com.cn", $sub['email'], $en->title, $body, "smtp.mail.yahoo.com.cn", "c_h3w4", "h12345" ) ) {
	$sub['lasttitle'] = $en->title;
	$sresult[] = $en->title;
      } else {
	$fresult[] = $en->title;
	break;
      }
    } 

    $result = array($sresult, $fresult);
    return $result;
  }

  function fowardallnewfeeds () {
    foreach ( $this->subscriptions as $sub ) {
      $rtn = $this->fwdnew ( $sub['link'] );
    }
  }
}

/* require_once "sendmail.php"; */

/* $m = new rssFwdSubManager; */
/* $m->getSubsJson(); */
/* $m->addSubscription ( 'liqi0327@gmail.com', "自行车游记", "this is link", '', '' ); */
/* $m->save(); */
/* $m->_showtable (); */
/* /\* $rtn = $m->fwdnew("http://bbs.running8.com/rss.php?fid=20&auth=0"); *\/ */
/* /\* print_r ( $rtn ); *\/ */
/* $m->fowardallnewfeeds(); */

?>
