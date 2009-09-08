<?php
require_once "Mail.php";
require_once 'Mail/mime.php';

function sendmail_auth ($from, $to, $subject, $body, $host, $usr, $pwd ) {
  $headers = array ('From' => $from, 'To' => $to, 'Subject' => $subject);
  $smtp = Mail::factory('smtp', array ('host'=>$host, 'auth'=>true, 'username'=>$usr, 'password'=>$pwd ));
  $mail = $smtp->send($to, $headers, $body);

  if (PEAR::isError($mail)) {
    return false;
    echo("<p>" . $mail->getMessage() . "</p>");
  } else {
    return true;
    echo("<p>Message successfully sent!</p>");
  }
}

function sendhtmlmail_auth ($from, $to, $subject, $html, $host, $usr, $pwd ) {
  $headers['From']    = $from;
  $headers['Subject'] = $subject;
  $paras['host']      = $host;
  $paras['auth']      = true;
  $paras['username']  = $usr;
  $paras['password']  = $pwd;

  $smtp = Mail::factory( 'smtp', $paras );

  $mime = new Mail_mime("\n");
  $mime->setHTMLBody($html);

  $body = $mime->get(
		     array("head_encoding" => "base64",
			   "text_encoding" => "8bit",
			   "html_charset"  => "UTF-8",
			   "text_charset"  => "UTF-8",
			   "head_charset"  => "UTF-8"));
  $headers = $mime->headers($headers);
  $mail = $smtp->send($to, $headers, $body);

  if (PEAR::isError($mail)) {
    return false;
    echo("<p>" . $mail->getMessage() . "</p>");
  } else {
    return true;
    echo("<p>Message successfully sent!</p>");
  }
}

/* $body = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> */
/* <html> */
/* <head> */
/* <meta http-equiv="content-type" content="text/html; charset=UTF-8"> */
/*   <title>Hello World!</title> */
/* </head> */
/* <body> */
/* <p>Hello World!</p> */
/* <p>你好</p> */
/* </body> */
/* </html>'; */
/* sendhtmlmail_auth ( "c_h3w4@yahoo.com.cn", */
/* 		    "mweiguo@gmail.com", */
/* 		    "你好", */
/* 		    $body, */
/* 		    "smtp.mail.yahoo.com.cn", */
/* 		    "c_h3w4", "h12345" ); */

?>