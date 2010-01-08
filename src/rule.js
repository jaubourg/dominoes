var rule = dominoes.rule = dataHolder( function( id ) {

	var rules = this,
		running = FALSE,
		callbacks = [],
		rule = rules[ id ] = rules[ id ] || function( callback , thread ) {
			
			if ( callback && callback !== noop ) {
				
				callbacks.push( callback );
				
			}
			
			if ( ! running ) {
				
				running = TRUE;
				
				var context = this;
				
				( function internal() {

					if ( list.length ) {
						
						execute( list.splice( 0 , list.length ) , context , thread , internal );
						
					} else if ( callbacks.length ) {
						
						while( callbacks.length ) {
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
		list = rule[ STR_ACTIONS ] = rule[ STR_ACTIONS ] || [];
	
	list.push( slice.call( arguments , 1 ) );

} );

