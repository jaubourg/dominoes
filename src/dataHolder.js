// Generic data holder
function dataHolder( create ) {
	
	var data = {};
	
	return function( id , del ) {
		
		var length = arguments.length;
		
		if ( length > 1 ) {
			
			if ( del === FALSE ) {
				
				if ( data[ id ] ) {
					
					delete data[ id ];
				
				}
				
			} else {
				
				create.apply( data , arguments );
				
			}
				
			
		} else if ( id === FALSE ) {
			
			data = {};
	
		} else if ( length ) {
			
			return data[ id ];
	
		}
		
		return this;
	};

}

