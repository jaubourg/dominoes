<?php

$number = $_REQUEST[ "number" ];

usleep( 400000 - 100000 * $number );

header("Content-type: application/javascript; charset=UTF-8");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");



if ( isset ( $_REQUEST[ "load" ] ) ) { ?>window.DOMINOES_UNIT_STRING += "L<?= $number ?>";<?php } ?>
dominoes.rule( "module<?= $number ?>.start" , function() {
	window.DOMINOES_UNIT_STRING += "S<?= $number ?>";
} );
