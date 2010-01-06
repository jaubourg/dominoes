var // List of functors
	functors = {};
	
dominoes.functor = function( id , functor ) {
	
	var length = arguments.length;
	
	if ( length > 1 ) {
		
		if ( functor === FALSE ) {
			
			if ( functors[ id ] ) {
				
				delete functors[ id ];
			
			}
		
		} else if ( isFunction( functor ) ) {
			
			functors[ id ] = functor;
			
		}
		
	} else if ( id === FALSE ) {
		
		functors = {};
		
	} else if ( length ) {
		
		return functors[ id ];
		
	}
	
	return this;
	
};

