var	properties = {};

// Declare or get a property
dominoes.property = function( id , value ) {
	
	var length = arguments.length;
	
	if ( length > 1 ) {
		
		if ( value === FALSE ) {
			
			if ( properties[ id ] ) {
				
				delete properties[ id ];
			
			}
		
		} else {
			
			properties[ id ] = value;
		
		}
		
	} else if ( id === FALSE ) {
		
		properties = {};
		
	} else if ( length ) {
		
		return properties[ id ];
		
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

