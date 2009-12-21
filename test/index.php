<?php

header("Content-type: text/html; charset=UTF-8");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");


?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" dir="ltr" id="html">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Dominoes Test Suite</title>
	<!-- QUnit -->
	<link rel="Stylesheet" media="screen" href="./qunit/qunit/qunit.css" />
	<script type="text/javascript" src="./qunit/qunit/qunit.js"></script>
	<!-- Some utilities -->
	<script type="text/javascript" src="./utils.js"></script>
	<!-- Dominoes -->
	<script type="text/javascript" src="../dist/dominoes.js"></script>
	<!-- Tests suites -->
<?php
    $list = array();
	$dir = opendir( $path = dirname( __FILE__ ) . "/unit/" );
	while ( $file = readdir( $dir ) ) {
		if ( is_file ( $path . $file ) ) {
			array_push( $list , $file );
		}
	}
	sort( $list );
	foreach ( $list as $file ) {
?>
	<script type="text/javascript" src="./unit/<?= $file ?>"></script>
<?php
	}
?>
</head>

<body id="body">
	<!-- QUNIT -->
	<h1 id="qunit-header">Dominoes Test Suite</h1>
	<h2 id="qunit-banner"></h2>
	<div id="qunit-testrunner-toolbar"></div>
	<h2 id="qunit-userAgent"></h2>
	<ol id="qunit-tests"></ol>
</body>
</html>
