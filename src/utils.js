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

