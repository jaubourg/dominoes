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
