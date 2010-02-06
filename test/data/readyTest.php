<?php

	header("Content-type: text/html; charset=UTF-8");
	header("Cache-Control: no-cache, must-revalidate");
	header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
	@apache_setenv('no-gzip', 1);
	@ini_set('output_buffering', 0);
	@ini_set('zlib.output_compression', 0);
	@ini_set('implicit_flush', 1);
	for ($i = 0; $i < ob_get_level(); $i++) { ob_end_flush(); }
    ob_implicit_flush(1);
    flush();
?>
<html>

<head>
	<script type="text/javascript" src="../../dist/dominoes.js"></script>
	<script type="text/javascript">
	dominoes( {
		
		chain: "getTime >| done",
		
		getTime: function() {
			this.now = ( new Date() ).getTime();
		},
		
		done: function() {
			parent.notifyFrameReady( document.getElementById("test") , ( new Date() ).getTime() - this.now );
		}
		
	} );
	</script>
</head>

<body>

<ul>

<?php

	for ($i = 0 ; $i < 1000 ; $i++) {

?>

	<li>ITEM #<?= $i ?></li>

<?php

	}

?>

</ul>

<div>HELLO</div>

<?php

	flush();
    for ($i = 0; $i < ob_get_level(); $i++) { ob_end_flush(); }
    ob_implicit_flush(1);
	sleep(2);

?>

<ul>

<?php

	for ($i = 0 ; $i < 1000 ; $i++) {

?>

	<li>ITEM #<?= $i ?></li>

<?php

	}

?>

</ul>

<div id="test">WORLD</div>

<img src="concat.php?wait=4000&nocache=<?= microtime() ?>" />

</body>

</html>