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
    
    $delay = round( isset( $_REQUEST[ "delay" ] ) ? ( 1 * $_REQUEST[ "delay" ] ) : 0 );
    
    if ( $delay < 0 ) {
    	$delay = 0;
    }
?>
<html>

<head>
	<style>
		td {
			text-align: center;
			border: solid 1px black;
		}
		
		td, th {
			padding: 3px;
		}
		
		tr.odd {
			background: lightgray;
		}
		
		table {
			border-collapse: collapse;
		}
		
	</style>
	<script type="text/javascript" src="../dist/dominoes.js"></script>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
	<script type="text/javascript">
	( function() {
	
		var times = {
				dominoes: dominoes.ready,
				jQuery: jQuery
			},
			start = ( new Date() ).getTime(),
			name;
		
		function listen( name ) {
			
			var tmp = times[ name ];
		
			times[ name ] = false;
			
			tmp( function() {
				times[ name ] = (new Date()).getTime() - start;
			} );
		}
		
		
		for ( var name in times ) {
			listen( name );
		}
		
		setTimeout( function() {
			
			var tmp = ["<table cellspacing='0'>",["<tr><th /><th /><th colspan='2'>Compared to...</th></tr><tr><th /><th>Time</th>"]],
				name,
				compName,
				time,
				compTime,
				diff,
				string,
				odd = true;
			
			for ( name in times ) {
				
				odd = ! odd;
				
				tmp[ 1 ].push.apply( tmp[ 1 ] , [ "<td>" , name , "</td>" ] );
				
				time = times[ name ];
				
				tmp.push.apply( tmp , [ "<tr" , ( odd ? " class='odd'" : "" ) , "><td>" , name , "</td><td>" , ( time ? ( Math.round( time / 10 ) / 100 ) + " s" : "?" ) , "</td>" ] );
				
				for ( compName in times ) {
					
					tmp.push("<td>")
					
					if ( compName === name ) {
						
						tmp.push( "" );
						
					} else if ( ! time || ! ( compTime = times[ compName ] ) ) {
						
						tmp.push( "?" );
						
					} else {
						
						diff = Math.round( 20000 * ( compTime - time ) / ( compTime + time ) ) / 100;
						
						if ( diff == 0 ) {
							
							tmp.push( "=" );
							
						} else {
						
							if ( diff > 0) {
								
								tmp.push( "<b>+ " );
								
							} else {
								
								tmp.push("- ")
							}
							
							tmp.push( diff < 0 ? - diff : diff );
							tmp.push(" %");
							
							if ( diff > 0 ) {
								tmp.push ( "</b>" );
							}
							
						}
						
					}
					
					tmp.push( "</td>" );
					
				}
				
				tmp.push( "</tr>");
				
			}
			tmp[ 1 ].push( "</tr>" );
			tmp[ 1 ] = tmp[ 1 ].join( "" );
			
			tmp.push( "</table>" );
			
			jQuery( "#result" ).html( tmp.join( "" ) );
			
			jQuery( "#post button" ).click( function() {
				jQuery( "#post input" ).val( jQuery("#get input[name=delay]").val() );
				jQuery( "#post" ).submit();
			} );
			
			jQuery( "#form" ).show();
			
		} , <?= ( $delay + 1 ) * 1000 ?> );
			
	} )();
	</script>
</head>

<body>

<div id="result">
LOADING with an internal delay of <?= $delay ?> seconds...
</div>
<br /><br />
<div id="form" style="display:none">
	<form id="get" method="GET">
		<b>new delay </b><input name="delay" type="text" value="0" /><br />
		<input type="submit" value="Submit as a GET" />
	</form>
	<form id="post" method="POST">
		<input name="delay" type="text" style="display:none" /> 
		<button>Submit as a POST</button>
	</form>
</div>

<div style="display:none">

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
	sleep($delay);

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

<img src="data/concat.php?wait=4000&nocache=<?= microtime() ?>" />

<div id="test">WORLD</div>

</div>

</body>

</html>