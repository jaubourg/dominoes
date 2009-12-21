var	// Keep track of loaded scripts
	loaded = {},
	// Keep track of loading scripts (list of callbacks)
	loading = {};
	
// Execute a single item
function executeItem( item , callback ) {

	// It's here that we check for global rules
	// In case they have been defined by previous items
	if ( isString( item ) ) {
		item = rules[ item ] || item ;
	}
	
	// Handle functions
	if ( isFunction( item ) ) {

		try {
			return item( callback );
		} catch( _ ) {}
		
		// If we end up here, something failed
		// And it's far better to break the chain
		return TRUE;
		
	} else {
	
		// Handle strings (build options object)
		if ( isString( item ) ) {
			item = {
				url: item,
				cache: TRUE
			};
		}
		
		// If no request, stop here
		if ( ! item || ! item.url ) {
			return;
		}
		
		// We reference values & eval the url
		// for substitutions in the process
		var url = item.url = eval( item.url ),
			cache = item.cache !== FALSE;
		
		// Check cache
		if ( cache ) {
			
			if ( loaded[ url ] ) {
				callback();
				return TRUE;
			} else if ( loading[ url ] ) {
				loading[ url ].push( callback );
				return TRUE;
			}
			loading[ url ] = [ callback ];
			
		} else {
			
			item.url += ( /\?/.test( url ) ? "&" : "?" ) + "_=" + ( new Date() ).getTime();
			
		}
		
		// Send request
		loadScript( item , function() {
			
			if ( cache ) {

				while ( loading[ url ].length ) {
					( loading[ url ].shift() ) ();
				}
				delete loading[ url ];
				loaded[ url ] = TRUE;
				
			} else {
				
				callback();
				
			}
		} );

		return TRUE;
	
	}
}

// Executes a sequence and calls the given callback if provided
function execute( sequence , callback ) {
	
	if ( sequence.length ) {
		
		var todo = [],
			item,
			num,
			done,
			i,
			length;
		
		while ( sequence.length && ( item = sequence.shift() ) && item !== s_wait && item !== s_ready ) {
			
			todo.push( isArray( item ) ? ( function() {

				var sub = item,
					optional = sub.pop();
				
				return function( callback ) {
					
					if ( optional ) {
						
						callback();
						later ( function() {
							execute( sub );
						} );
						
					} else {
						execute( sub , callback );
					}
					
					return TRUE;
					
				};

			} )() : item );
		}
		
		num = todo.length;
		
		done = sequence.length || callback
		?
			function () {
				if ( ! --num ) {
					if ( item === s_ready ) {
						ready( execute , sequence , callback );
					} else {
						execute( sequence , callback );
					}
				}
			}
		:
			noOp;

		if ( num ) {
            
			for ( i = 0 , length = todo.length ; i < length ; i++ ) {
				if ( executeItem( todo[ i ] , done ) !== TRUE ) {
					done();
				}
			}
			
		} else {

			num = 1;
			done();
		}
		
	} else {
		
		if ( callback ) {
			
			callback();
			
		}
		
	}
	
	return TRUE;
}

