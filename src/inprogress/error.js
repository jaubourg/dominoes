/**
 * Throw an exception
 * @param type error type
 * @param msg error message
 */
function error( type , msg ) {
	
	throw [ exportName , type , msg ].join( ": " );  
	
}