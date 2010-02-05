var readyCallbacks = [],
	readyListenedTo = FALSE,
	readyAcknowledged = FALSE,
	readyFireing = FALSE,
	
	// Data for event handling
	readyEventData = {
		addEventListener: [ "DOMContentLoaded" , "load" , noop ],
		attachEvent: [ STR_ON_READY_STATE_CHANGE , STR_ON_LOAD , function() {

			if ( documentElement.doScroll ) {
				
				try {
					if ( window.frameElement == NULL ) {
						
						( function doScrollCheck() {
							
							try {
								// If IE is used, use the trick by Diego Perini
								// http://javascript.nwbox.com/IEContentLoaded/
								documentElement.doScroll( "left" );
								acknowledgeReady();
								
							} catch( _ ) {
								
								later( doScrollCheck );
								
							}
							
						} )();
						
					}
					
				} catch( e ) {}
			}
		}]
	}
	
function fireReady() {
	
	while ( readyCallbacks[ STR_LENGTH ] ) {
			args = readyCallbacks.shift();
			args[ 0 ][ STR_APPLY ]( document , slice[ STR_CALL ]( args , 1 ) );
	}
	
	readyFireing = FALSE;
	
}

function acknowledgeReady() {
	
	if ( ! readyAcknowledged ) {

		readyAcknowledged = TRUE;
		later( ready );
		
	}
}

function ready( func ) {
	
	if ( isFunction ( func ) ) {
		
		readyCallbacks[ STR_PUSH ]( arguments );
		
	}
		
	if ( ! readyListenedTo ) {
		
		readyListenedTo = TRUE;
		
		readyAcknowledged = loadedCompleteRegExp.test( document[ STR_READY_STATE ] );
			
		if ( ! readyAcknowledged ) {
			
			var funcName,
				info;
				
			for ( funcName in readyEventData ) {
				
				if ( document[ funcName ] ) {
					
					info = readyEventData[ funcName ];				
					
					document[ funcName ]( info[ 0 ] , acknowledgeReady , FALSE );
					window[ funcName ]( info[ 1 ] , acknowledgeReady , FALSE );					
					info[ 2 ]();
					
					break;
				}
				
			}
		
		}
		
	}
	
	if ( readyAcknowledged && ! readyFireing ) {
		
		readyFireing = TRUE;
		fireReady();
		
	}
	
	return FALSE;
}

