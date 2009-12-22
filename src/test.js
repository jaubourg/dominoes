// Enables to inspect parser's outputs
dominoes.parse = function() {
	return parseList( arguments );
};

// View parse result
dominoes.viewParse = function( parse ) {
	
	var output = "",
		cumul = [];
	
	if ( isArray( parse ) ) {
		for ( var i in parse ) {
			cumul.push( dominoes.viewParse( parse[i] ) );
		}
		output = "[ "+cumul.join(" , ")+" ]";
	} else if ( isFunction( parse ) ) {
		output = "<Function>";
	} else {
		output = "" + parse;
	}
	
	return output;
}

