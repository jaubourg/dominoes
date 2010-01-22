var rule = dominoes.rule = dataHolder( function( id ) {

	var rules = this,
		running = FALSE,
		callbacks = [],
		rule = rules[ id ] = rules[ id ] || function( callback , thread ) {
			
			if ( callback && callback !== noop ) {
				
				callbacks[ STR_PUSH ]( callback );
				
			}
			
			if ( ! running ) {
				
				running = TRUE;
				
				var context = this;
				
				( function internal() {

					if ( list[ STR_LENGTH ] ) {
						
						execute( list.splice( 0 , list[ STR_LENGTH ] ) , context , thread , internal );
						
					} else if ( callbacks[ STR_LENGTH ] ) {
						
						while( callbacks[ STR_LENGTH ] ) {
							( callbacks.shift() )();
						}
						
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

