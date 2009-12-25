var	rules = {},
	rulesInternals = {};

// Declare or get a rule
dominoes.rule = function( id , del ) {
	
	var length = arguments.length;
	
	if ( length > 1 ) {
		
		if ( del === FALSE ) {
			
			if ( rules[ id ] ) {
				
				delete rules[ id ];
				delete rulesInternals[ id ];
			
			}
			
		} else {
		
			var list = parseList( slice.call( arguments , 1 ) ),
				ruleInternal = rulesInternals[ id ];
				
			// Create entry no matter what
			if ( ! ruleInternal ) {
	
				var go = function() {
						execute( ruleInternal , function() {
							if ( running = list.length ) {
								running--;
								list.shift()();
								if ( running ) {
									go();
								}
							}
						} );
					},
					running;
					
				ruleInternal = rulesInternals[ id ] = [];
				rules[ id ] = function ( callback ) {
					if ( isFunction(callback) ) {
						list.push( callback );
					}
					if ( ! running ) {
						running = TRUE;
						go();
					}
					return true;
				};
			}
			
			// Filter out empty lists
			if ( list.length ) {
		
				// Note as non optional
				list.push( FALSE );
				
				// Add in
				ruleInternal.push( list );
			}
			
			// Free list for re-use
			list = [];
			
		}
		
	} else if ( id === FALSE ) {
		
		rules = {};
		rulesInternals = {};

	} else if ( length ) {
		
		return rules[ id ];

	}
	
	return this;
};

