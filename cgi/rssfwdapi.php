<?php

// api functions
function getSubscriptionList () {
  $f = new rssFwdSubManager();
  echo $f->getSubsJson ();
}

function addSubscription ( $paras ) {
  $email = $paras['email'];
  $name = $paras['name'];
  $link = $paras['link'];
  if ( $email && $link ) {
    $f = new rssFwdSubManager();
    $f->addSubscription ( $email, $name, $link, '', '' );
    $f->save();
  }
}

function removeSubscription ( $paras ) {
  $f = new rssFwdSubManager();
  $f->deleteSubscription ( $paras['link'] );
  $f->save();
}

function checkRssFeeds ( $paras ) {
    $f = new rssFwdSubManager();
    $rtn = $f->check( $paras['link'] );
    $f->save();
    echo json_encode ( $rtn );
}

function fowardNewRssFeeds ( $paras ) {
    $f = new rssFwdSubManager();
    $rtn = $f->fwdnew( $paras['link'] );
    $f->save();
    echo json_encode ( $rtn );
}

function fowardAllNewFeeds () {
    $f = new rssFwdSubManager();
    $f->fowardallnewfeeds ();
    //    $f->save();
}



require_once "stdinclude.php";
require_once "rssfwd.php";

// dispatch function
try {
  if ( $_SERVER['REQUEST_METHOD'] != 'GET' )
    return;

  if ( !function_exists ($_GET['cmd']) || !$_GET['cmd'] ) 
    return;

  $cmd = $_GET['cmd'];
  // get parameters
  $paras = array();
  foreach ( $_GET as $key=>$value ) {
    $paras[$key] = $value;
  }
  $cmd ( $paras );
} 
catch ( Exception $e )
{
}

?>