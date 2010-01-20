var readyCallbacks = [],
	readyListenedTo = FALSE,
	readyAcknowledged = FALSE,
	readyFireing = FALSE;
	
function fireReady() {
	
	while ( readyCallbacks[ STR_LENGTH ] ) {
			args = readyCallbacks.shift();
			args[0].apply( document , slice.call( args , 1 ) );
	}
	
	readyFireing = FALSE;
	
}

function testReady() {
					
	if ( document[ STR_GET_ELEMENTS_BY_TAG_NAME ]
		&& document.body
		&& document[ STR_GET_ELEMENTS_BY_TAG_NAME ]("body")[ STR_LENGTH ] ) {
	
		readyAcknowledged = readyFireing = TRUE;
		later( fireReady );
		
		return TRUE;	
	}
	
}
	
function ready( func ) {
	
	if ( isFunction ( func ) ) {
		
		readyCallbacks.push( arguments );
		
		if ( ! readyListenedTo ) {
			
			readyListenedTo = TRUE;
			
			if ( ! testReady() ) {
				poll( testReady );
			}
			
		} else if ( readyAcknowledged && ! readyFireing ) {
			
			readyFireing = TRUE
			fireReady();
			
		}
		
	}
	
	return FALSE;
}

