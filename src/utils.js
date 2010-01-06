/* Most of the code here has been taken from jQuery
 * (c)2010 John Resig
 * http://jquery.com/
 */
var	// Head node
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

function loadScript( options , callback ) {
	
	var script = document.createElement("script");
	
	script.src = options[ STR_URL ];
	
	if ( options[ STR_CHARSET ] ) {
		script[ STR_CHARSET ] = options[ STR_CHARSET ];
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

			callback && callback();
		}
	};
	
	// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
	// This arises when a base node is used (jQuery #2709 and #4378).
	head.insertBefore( script, head.firstChild );
}

