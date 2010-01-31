var readyCallbacks = [],
	readyListenedTo = FALSE,
	readyAcknowledged = FALSE,
	readyFireing = FALSE;
	
function fireReady() {
	
	while ( readyCallbacks[ STR_LENGTH ] ) {
			args = readyCallbacks.shift();
			args[ 0 ][ STR_APPLY ]( document , slice[ STR_CALL ]( args , 1 ) );
	}
	
	readyFireing = FALSE;
	
}

function testReady() {
					
	if ( ( ! document[ STR_READY_STATE ] || document[ STR_READY_STATE ] === "complete" ) 
		&& document.body ) {
	
		readyAcknowledged = readyFireing = TRUE;
		later( fireReady );
		
		return FALSE;	
	}
	
}
	
function ready( func ) {
	
	if ( isFunction ( func ) ) {
		
		readyCallbacks[ STR_PUSH ]( arguments );
		
		if ( ! readyListenedTo ) {
			
			readyListenedTo = TRUE;
			
			if ( ! testReady() ) {
				poll( testReady );
			}
			
		} else if ( readyAcknowledged && ! readyFireing ) {
			
			readyFireing = TRUE;
			fireReady();
			
		}
		
	}
	
	return FALSE;
}

