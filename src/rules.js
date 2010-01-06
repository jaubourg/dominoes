var	rules = {};

// Declare or get a rule
dominoes.rule = function( id , del ) {
	
	var length = arguments.length;
	
	if ( length > 1 ) {
		
		if ( del === FALSE ) {
			
			if ( rules[ id ] ) {
				
				delete rules[ id ];
			
			}
			
		} else {
			
			var running = FALSE,
				callbacks = [],
				rule = rules[ id ] = rules[ id ] || function( callback , thread ) {
					
					if ( callback && callback !== noOp ) {
						
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
		
		}
		
	} else if ( id === FALSE ) {
		
		rules = {};
		rulesInternals = {};

	} else if ( length ) {
		
		return rules[ id ];

	}
	
	return this;
};

