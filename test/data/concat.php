<?php

if ( isset ( $_REQUEST [ "wait" ] ) ) {
	usleep( 1000 * $_REQUEST [ "wait" ] );
}

header("Content-type: application/javascript; charset=UTF-8");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

?>
window.DOMINOES_UNIT_STRING += "<?= $_REQUEST [ "str" ] ?>";
