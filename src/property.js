var	properties = {};

// Declare or get a property
dominoes.property = function( id , value ) {
	
	var length = arguments.length;
	
	if ( length > 1 ) {

		properties[ id ] = value;
		
	} else if ( length ) {
		
		return properties[ id ];
		
	} else {
		
		properties = {};
	}
	
	return this;
	
};

// Recursive evaluation (used for urls)
function eval( string ) {
	
	var previous;
	
	while ( string && previous != string ) {
	
		previous = string;
		
		string = string.replace( /\${([^}]*)}/ , function( _ , $1 ) {
			return properties [ $1 ] || "";
		});
	}
	
	return string || "";
}

// Eval as an utility for third parties
dominoes.eval = eval;

