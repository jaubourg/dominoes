// Generic data holder
function dataHolder( create ) {
	
	var data = {};
	
	function func( id , del , ifNot ) {
		
		var length = arguments[ STR_LENGTH ];
		
		if ( length > 1 ) {
			
			if ( del === FALSE ) {
				
				if ( data[ id ] ) {
					
					delete data[ id ];
				
				}
				
			} else if ( ! ifNot || ! data[ id ] ) {
				
				if ( create ) {
					
					create[ STR_APPLY ]( data , arguments );
					
				} else {
					
					data[ id ] = del;
					
				}
				
			}
				
			
		} else if ( id === FALSE ) {
			
			data = {};
	
		} else if ( length ) {
			
			if ( isString( id ) ) {
			
				return data[ id ];
				
			} else {
				
				for ( var name in id ) {
					
					func( name , id[ name ] );
					
				}
				
			}
	
		}
		
		return dominoes;
	}
	
	func.ifNot = function ( id , value ) {
		
		return func( id , value , TRUE );
		
	};
	
	return func;

}

