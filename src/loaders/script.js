var loadScript = loader( function ( options , callback ) {
	
	var script = document[ STR_CREATE_ELEMENT ]( "script" ),
		readyState;
	
	script[ STR_ASYNC ] = STR_ASYNC;
	
	if ( options[ STR_CHARSET ] ) {
		script[ STR_CHARSET ] = options[ STR_CHARSET ];
	}
	
	script.src = options[ STR_URL ];
	
	// Attach handlers for all browsers
	script[ STR_ON_LOAD ] = script[ STR_ON_READY_STATE_CHANGE ] = function() {
		
		if ( ! ( readyState  = script[ STR_READY_STATE ] ) || loadedCompleteRegExp.test( readyState ) ) {

			// Handle memory leak in IE
			script[ STR_ON_LOAD ] = script[ STR_ON_READY_STATE_CHANGE ] = NULL;
			
			head.removeChild( script );

			if ( callback ) {
				// Give time for execution (thank you so much, Opera devs!)
				later( callback );
			}
		}
	};
	
	// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
	// This arises when a base node is used (jQuery #2709 and #4378).
	head.insertBefore( script, head.firstChild );
	
} );

