var	// Head node
	documentElement = document.documentElement,
	head = document[ STR_GET_ELEMENTS_BY_TAG_NAME ]( "head" )[ 0 ] || documentElement,

	// References
	toString = {}.toString,
	slice = [].slice,
	
	// RegExp
	loadedCompleteRegExp = /loaded|complete/,
	
	// Type control
	types = "Array Function String".split(" "),
	temp = types[ STR_LENGTH ];
	
// noop
function noop() {}

// Defer execution
function later( func , self ) {
	setTimeout( function() {
		func[ STR_APPLY ]( self || window , slice[ STR_CALL ]( arguments , 2 ) );
	} , 0 );
	return dominoes;
}

dominoes.later = later;

// Utilities
while ( temp-- ) {
	( function( name , str ) {
		str = "[object " + name + "]";
		dominoes[ "is" + name ] = function( object ) {
			return toString[ STR_CALL ]( object ) === str;
		};
	} )( types[ temp ] );
}

var isArray = dominoes.isArray,
	isFunction = dominoes.isFunction,
	isString = dominoes.isString;

