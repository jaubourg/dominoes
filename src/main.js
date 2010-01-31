// Throw an exception
function error( type , msg ) {
	
	throw [ STR_DOMINOES , type , msg ].join( ": " );  
	
}

// Main function
function dominoes() {
	execute ( slice[ STR_CALL ]( arguments , 0 ) , {} , {} , noop );
	return dominoes;
}

dominoes.run = dominoes;

