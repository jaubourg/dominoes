var readyCallbacks = [],
	readyIndex,
	readyListenedTo = FALSE,
	readyAcknowledged = FALSE,
	readyFireing = FALSE,
	readyScript;
	
function fireReady() {
	
	for ( readyIndex = 0 ; readyIndex < readyCallbacks[ STR_LENGTH ] ; ) {
			args = readyCallbacks[ readyIndex++ ];
			args[ 0 ][ STR_APPLY ]( document , slice[ STR_CALL ]( args , 1 ) );
	}
	
	readyCallbacks = [];
	
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

			if ( document[ STR_ADD_EVENT_LISTENER ] ) {

				document[ STR_ADD_EVENT_LISTENER ]( "DOMContentLoaded" , acknowledgeReady , FALSE );
				window[ STR_ADD_EVENT_LISTENER ]( "load" , acknowledgeReady , FALSE );
				
			} else {
				
				readyScript = document[ STR_CREATE_ELEMENT ]( "script" );
				
				readyScript.src = "http://" + ( new Date() ).getTime();
				readyScript.defer = "defer";
				
				readyScript[ STR_ON_READY_STATE_CHANGE ] = function() {
					
					if ( loadedCompleteRegExp.test( readyScript[ STR_READY_STATE ] ) ) {
						head.removeChild( readyScript );
						readyScript = undefined;
						acknowledgeReady();
					}
					
				};
				
				head[ STR_APPEND_CHILD ]( readyScript );
			}
		}
		
	}
	
	if ( readyAcknowledged && ! readyFireing ) {
		
		readyFireing = TRUE;
		fireReady();
		
	}
	
	return FALSE;
}

dominoes.ready = ready;

