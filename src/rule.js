var	rules = {},
	rulesInternals = {};

// Declare or get a rule
dominoes.rule = function( id ) {
	
	var length = arguments.length;
	
	if ( length > 1 ) {
		
		var list = parseList( slice.call( arguments , 1 ) , {} , TRUE ),
			ruleInternal = rulesInternals[ id ];
	
		// Create entry no matter what
		if ( ! ruleInternal ) {
			ruleInternal = rulesInternals[ id ] = [];
			rules[ id ] = function ( callback ) {
				return execute( ruleInternal , callback );
			};
		}
		
		// Filter out empty lists
		if ( list.length ) {
	
			// Note as non optional
			list.push( FALSE );
	
			// Add in
			ruleInternal.push( list );
		}
		
	} else if ( length ) {
		
		return rules[ id ];

	} else {

		rules = {};
		rulesInternals = {};
	}
	
	return this;
};

