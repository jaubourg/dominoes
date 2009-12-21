var	// Regexp
	rspaces = /\s+/,
	
	// Head node
	head = document.getElementsByTagName("head")[0] || document.documentElement,

	// References
	toString = {}.toString,
	slice = [].slice;
	
// NoOp
function noOp() {}

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

function later( func ) {
	setTimeout( func , 1 );
}

function loadScript( options , callback ) {
	
	var script = document.createElement("script");
	
	script.src = options.url;
	
	if ( options.charset ) {
		script.charset = options.charset;
	}

	// Attach handlers for all browsers
	script.onload = script.onreadystatechange = function() {
		
		var readyState = script.readyState;
		
		if ( ! readyState || readyState === "loaded" || readyState === "complete" ) {

			// Handle memory leak in IE
			script.onload = script.onreadystatechange = NULL;
			
			if ( head && script.parentNode ) {
				head.removeChild( script );
			}

			callback();
		}
	};
	
	// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
	// This arises when a base node is used (jQuery #2709 and #4378).
	head.insertBefore( script, head.firstChild );
}

