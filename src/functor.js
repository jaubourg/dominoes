var functor = dominoes.functor = dataHolder( function( id , func ) {
	
	if ( isFunction( func ) ) {
		this[ id ] = func;
	}
	
} );

