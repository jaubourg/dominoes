var	// Head node
	head = document[ STR_GET_ELEMENTS_BY_TAG_NAME ]("head")[0] || document.documentElement,

	// References
	toString = {}.toString,
	slice = [].slice;
	
// noop
function noop() {}

// Defer execution
function later( func , self ) {
	var args = slice.call( arguments , 2 )
	setTimeout( function() {
		func.apply( self || window , args );
	} , 0 );
	return this;
}

dominoes.later = later;

// Utilities
function isArray( object ) {
	return toString.call( object ) === "[object Array]";
}

function isFunction( object ) {
	return toString.call( object ) === "[object Function]";
}

function isString( object ) {
	return typeof object === "string";
}

/* Code based on jQuery
 * (c)2010 John Resig
 * http://jquery.com/
 */
function loadScript( options , callback ) {
	
	var script = document.createElement("script"),
		url = options[ STR_URL ],
		readyState;
	
	// HTML5: say it's async
	script.async = "async";
	
	if ( options[ STR_CHARSET ] ) {
		script[ STR_CHARSET ] = options[ STR_CHARSET ];
	}

	// Opera doesn't re-execute scripts with same url
	script.src = url + ( options[ STR_CACHE ] === FALSE ? ( ( /\?/.test( url ) ? "&" : "?" ) + "_=" + (new Date()).getTime() ) : "" );
	
	// Attach handlers for all browsers
	script[ STR_ON_LOAD ] = script[ STR_ON_READY_STATE_CHANGE ] = function() {
		
		if ( ! ( readyState  = script.readyState ) || readyState === "loaded" || readyState === "complete" ) {

			// Handle memory leak in IE
			script[ STR_ON_LOAD ] = script[ STR_ON_READY_STATE_CHANGE ] = NULL;
			
			if ( head && script.parentNode ) {
				head.removeChild( script );
			}

			if ( callback ) {
				// Give time for execution (thank you so much, Opera devs!)
				later( callback );
			}
		}
	};
	
	// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
	// This arises when a base node is used (jQuery #2709 and #4378).
	head.insertBefore( script, head.firstChild );
}

