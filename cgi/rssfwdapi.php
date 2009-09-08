<?php
$includepath = ini_get('include_path');
$includepath .= ";C:/php-5.2.8-Win32/PEAR";
ini_set ( 'include_path', $includepath);

// api functions
function getSubscriptionList () {
  $f = new rssFwdSubManager();
  echo $f->getSubsJson ();
}

function addSubscription ( $paras ) {
  print_r ( $paras );
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
  print_r ( $paras );
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