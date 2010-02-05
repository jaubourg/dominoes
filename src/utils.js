var	// Head node
	documentElement = document.documentElement,
	head = document[ STR_GET_ELEMENTS_BY_TAG_NAME ]( "head" )[ 0 ] || documentElement,

	// References
	toString = {}.toString,
	slice = [].slice,
	
	// RegExp
	loadedCompleteRegExp = /loaded|complete/,
	
	// Temp var
	temp;
	
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
for ( temp in { Array:1 , Function:1 , String:1 } ) {
	( function( name , str ) {
		str = "[object " + name + "]";
		dominoes[ "is" + name ] = function( object ) {
			return toString[ STR_CALL ]( object ) === str;
		};
	} )( temp );
}

var isArray = dominoes.isArray,
	isFunction = dominoes.isFunction,
	isString = dominoes.isString;

