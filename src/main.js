/**
 * Throw an exception
 * @param type error type
 * @param msg error message
 */
function error( type , msg ) {
	
	throw [ exportName , type , msg ].join( ": " );  
	
}

/**
 * Main function
 * @param actions
 */
function dominoes() {
	execute ( slice.call( arguments , 0 ) , {} , {} , noop );
	return this;
}

