module("Plugins");

function pluginRules() {
	
	if ( ! dominoes.rule("jQuery") ) {
		dominoes
			.rule( "jQuery" , "http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js" )
			.functor( "css{O}" , function(options) {
				return {
					chain: "../dist/dominoes-css.js > $css{options}",
					options: options
				}
			});
	}
	
}

test( "Loading CSS (local)" , function() {
	
	stop();
	
	pluginRules();
	
	dominoes("$css{data/style.php?left=27&wait=1000} jQuery >|" , function() {
		var div = $("<div class='dominoes'/>").appendTo($("body"));
		strictEqual( div.css("marginLeft") , "27px" , "Margin left was set to 27px" );
		div.remove();
		start();
	});
	
});

test( "Loading CSS (remote)" , function() {
	
	stop();
	
	pluginRules();
	
	dominoes("$css{http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/ui-lightness/jquery-ui.css} jQuery >|" , function() {
		var div = $("<div class='ui-icon' />").appendTo($("body")),
			textIndent = 1 * div.css("textIndent").replace(/px/,"");
			
		// Opera 16bits capping
		if ( textIndent === -32768 ) {
			strictEqual( textIndent , -32768 , "CSS has been properly applied" );
		} else {
			strictEqual( textIndent , -99999 , "CSS has been properly applied" );
		}
		
		div.remove();
		
		start();		
	});
	
});

