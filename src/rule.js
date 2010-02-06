var rule = dominoes.rule = dataHolder( function( id ) {

	var rules = this,
		running = FALSE,
		callbacks = [],
		rule = rules[ id ] = rules[ id ] || function( callback , thread ) {
			
			callbacks[ STR_PUSH ]( callback );
			
			if ( ! running ) {
				
				running = TRUE;
				
				var context = this, i;
				
				( function internal() {

					if ( list[ STR_LENGTH ] ) {
						
						execute( list.splice( 0 , list[ STR_LENGTH ] ) , context , thread , internal );
						
					} else if ( callbacks[ STR_LENGTH ] ) {
						
						for ( i = 0 ; i < callbacks[ STR_LENGTH ] ; ) {
							callbacks[ i++ ]();
						}
						
						callbacks = [];
						
						internal();
						
					} else {
						
						running = FALSE;
						
					}
					
				} )();						
			}
			
			return FALSE;
		},
		list = rule.A = rule.A || [];
	
	list[ STR_PUSH ]( slice[ STR_CALL ]( arguments , 1 ) );

} );

