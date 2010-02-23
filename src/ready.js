var ready = ( function ( readyCallbacks , readyListenedTo , readyAcknowledged , readyFireing ) {
	
	function fireReady( index , args ) {
		
		for ( index = 0 ; index < readyCallbacks[ STR_LENGTH ] ; ) {
				args = readyCallbacks[ index++ ];
				args[ 0 ][ STR_APPLY ]( args[ 1 ] , args[ 2 ] );
		}
		
		readyCallbacks = [];
		
		readyFireing = FALSE;
		
	}
	
	function acknowledgeReady() {
		
		if ( ! readyAcknowledged ) {
	
			readyAcknowledged = readyFireing = TRUE;
			fireReady();
			
		}
	}
	
	return dominoes.ready = function ( func , context ) {
		
		if ( isFunction ( func ) ) {
			
			readyCallbacks[ STR_PUSH ]( [ func , context || document , slice[ STR_CALL ]( arguments , 2 ) ] );
			
			if ( ! readyListenedTo ) {
				
				readyListenedTo = TRUE;
				
				readyAcknowledged = loadedCompleteRegExp.test( document[ STR_READY_STATE ] );
					
				if ( ! readyAcknowledged ) {
					
					if ( document[ STR_ADD_EVENT_LISTENER ] ) {
		
						document[ STR_ADD_EVENT_LISTENER ]( "DOMContentLoaded" , acknowledgeReady , FALSE );
						window[ STR_ADD_EVENT_LISTENER ]( "load" , acknowledgeReady , FALSE );
						
					} else if ( window[ STR_ATTACH_EVENT ] ) {
						
						window[ STR_ATTACH_EVENT ]( STR_ON_LOAD , acknowledgeReady );
						
						document[ STR_ATTACH_EVENT ]( STR_ON_READY_STATE_CHANGE , function() {
							
							if ( loadedCompleteRegExp.test( document[ STR_READY_STATE ] ) ) {
								acknowledgeReady();
							}
							
						} );
						
						try {
							
							if ( window.frameElement == NULL && documentElement[ STR_DO_SCROLL ] ) {
								
								( function doScroll() {
									
									if ( ! readyAcknowledged ) {
									
										try {
											
											// If IE is used, use the trick by Diego Perini
											// http://javascript.nwbox.com/IEContentLoaded/
											documentElement[ STR_DO_SCROLL ]("left");
											
											later( acknowledgeReady );
											
										} catch( _ ) {
											
											later( doScroll );
											
										}
									}
									
								} )();
								
							}
							
						} catch( _ ) {
						}

					}
				}
				
			}
			
			if ( readyAcknowledged && ! readyFireing ) {
				
				readyFireing = TRUE;
				fireReady();
				
			}
		}
		
		return FALSE;
	};
	
} )( [] );

