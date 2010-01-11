module("Plugins");

function pluginRules() {
	
	if ( ! dominoes.rule("jQuery") ) {
		dominoes
			.rule( "jQuery" , "http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js" )
			.rule( "plugin/css" , "../dist/dominoes-css.js" )
			.functor( "cssTest" , function(action) {
				return {
					chain: "jQuery { plugin/css > $css{action} } >|",
					action: action
				}
			});
	}
	
}

test( "Loading CSS" , function() {
	
	stop();
	
	pluginRules();
	
	dominoes("$cssTest{data/style.php?left=27&wait=1000}" , function() {
		
		strictEqual( $("<div class='dominoes' />").appendTo($("body")).css("marginLeft") , "27px" , "Margin left was set to 27px" );
		start();
		
		
	})
	
});