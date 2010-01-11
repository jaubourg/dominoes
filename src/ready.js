var readyCallbacks = [],
	readyListening = FALSE;

function ready( func ) {
	
	if ( isFunction ( func ) ) {
		
		if ( readyCallbacks ) {
			
			readyCallbacks.push( arguments );
		
			if ( ! readyListening ) {
				
				readyListening = TRUE;
				
				function listen() {
					
					if ( document[ STR_GET_ELEMENTS_BY_TAG_NAME ]
						&& ( document.body
							|| document[ STR_GET_ELEMENTS_BY_TAG_NAME ]("body").length ) ) {
						
						while ( readyCallbacks.length ) {
								args = readyCallbacks.shift();
								args[0].apply( document , slice.call( args , 1 ) );
						}
							
						readyCallbacks = undefined;
										
					} else {
						
						setTimeout( listen , 13 );
						
					}
					
				}
				
				listen();
				
			}
			
		} else {
			
			func.apply( document , slice.call( arguments , 1 ) );
		
		}
		
		return FALSE;
	}
}


