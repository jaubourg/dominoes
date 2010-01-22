function loader( loadFunction ) {
	
	var loaded = {},
		loading = {};

	return function( options , callback ) {
		
		var _options = {},
			callbacks,
			url = options[ STR_URL ],
			key;
			
		if ( options[ STR_CACHE ] === FALSE ) {
			
			for ( key in options ) {
				_options[ key ] = options[ key ];
			}
			
			options = _options;
		
			options[ STR_URL ] += ( /\?/.test( url ) ? "&" : "?" ) + "_=" + ( new Date() ).getTime();
			
			loadFunction( options , callback );
			
		} else if ( loaded[ url ] ) {
			
			callback();
			
		} else if ( callbacks = loading[ url ] ) {
			
			callbacks[ STR_PUSH ]( callback );
			
		} else {
			
			loading[ url ] = callbacks = [ callback ];
			
			loadFunction( options , function() {
				
				while( callbacks[ STR_LENGTH ] ) {
					
					( callbacks.shift() )();
					
				}
				
				delete loading[ url ];
				loaded[ url ] = TRUE;
				
			} );
			
		}
		
	};
}

