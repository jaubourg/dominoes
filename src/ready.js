/* Code based on jQuery
 * (c)2010 John Resig
 * http://jquery.com/
 */
var readyCallbacks = [];

function ready( func ) {
	
	if ( isFunction ( func ) ) {
		
		bindReady();
			
		if ( readyCallbacks ) {
			
			readyCallbacks.push( arguments );
		
		} else {
			
			func.apply( document , slice.call( arguments , 1 ) );
		
		}
		
		return FALSE;
	}
}

function bindReady() {
		
	// Will be called only once
	bindReady = noOp;

	// To be called at the end
	function notify() {
		
		var args;
		
		if ( readyCallbacks ) {
		
			while ( readyCallbacks.length ) {
				args = readyCallbacks.shift();
				args[0].apply( document , slice.call( args , 1 ) );
			}
			
			readyCallbacks = undefined;
		}
	}
	
	// Catch cases where the browser event has already occurred.
	if ( document.readyState === STR_COMPLETE ) {
		return notify();
	}
	
	// Mozilla, Opera and webkit nightlies currently support this event
	if ( document.addEventListener ) {
		// Use the handy event callback
		document.addEventListener( STR_DOM_CONTENT_LOADED , function DOMContentLoaded() {
			document.removeEventListener( STR_DOM_CONTENT_LOADED , DOMContentLoaded , FALSE );
			notify();
		}, FALSE );
		
		// A fallback to window.onload, that will always work
		window.addEventListener( "load", notify, FALSE );

	// If IE event model is used
	} else if ( document.attachEvent ) {
		// ensure firing before onload,
		// maybe late but safe also for iframes
		document.attachEvent( STR_ON_READY_STATE_CHANGE , function onreadystatechange() {
			// Make sure body exists, at least, in case IE gets a little overzealous (jQuery #5443).
			if ( document.readyState === STR_COMPLETE ) {
				document.detachEvent( STR_ON_READY_STATE_CHANGE , onreadystatechange );
				notify();
			}
		});
		
		// A fallback to window.onload, that will always work
		window.attachEvent( STR_ON_LOAD , notify );

		// If IE and not a frame
		// continually check to see if the document is ready
		var toplevel = FALSE;

		try {
			toplevel = window.frameElement == NULL;
		} catch(e){}

		if ( document.documentElement.doScroll && toplevel ) {
			doScrollCheck();

			function doScrollCheck() {
				if ( ! readyCallbacks ) {
					return;
				}

				try {
					// If IE is used, use the trick by Diego Perini
					// http://javascript.nwbox.com/IEContentLoaded/
					document.documentElement.doScroll("left");
				} catch( error ) {
					setTimeout( doScrollCheck , 1 );
					return;
				}

				// and execute any waiting functions
				notify();
			}
		}
	}
}

