var STR_CHAIN = "chain",
	STR_OPTIONAL = "__dopt",
	STR_PARALLEL = "__dpara",
	STR_URL = "url",
	
	R_TRANS = /^(.*)\$([^\${}]*){([^\${}]*)}(.*)$/;
	
/**
 * Executes callback when DOM is ready
 * @param callback
 */
function executeReady( callback ) {
	ready( callback );
	return TRUE;
}

/**
 * Executes an item
 * @param item the item to be executed
 * @param context the context of the item
 * @param thread current running thread
 * @param callback function to be called once finished
 */
function execute( item , context , thread , callback ) {
	
	if ( item[ STR_OPTIONAL ] && callback ) {
		callback();
		callback = undefined;
	}

	if ( item ) {
	
		context = context || {};
		thread = thread || {};
		
		if ( item[ STR_CHAIN ] ) {
			context = item;
			item = item[ STR_CHAIN ];
		}
		
		if ( item[ STR_URL ] ) {
			
			loadScript( item , callback );
			
		} else if ( isString( item ) ) {
			
			execute( parse( item , context , thread ) , context , thread , callback );
			
		} else if ( isFunction( item ) ) {
			
			if ( item.call( context , callback || noOp , thread ) !== true ) {
				callback && callback();
			}
		
		} else if ( isArray( item ) ) {
			
			var length = item.length;
			
			if ( length ) {
			
				if ( item[ STR_PARALLEL ] ) {
					
					var i = 0,
						num = length,
						barrier = callback ? function() {
							if ( ! --num ) {
								callback();
							}
						} : undefined ;
			
					while ( i++ < length ) {
						execute( item[ i ] , context , thread , barrier );
					}
					
				} else {
				
					( function iterate( i ) {
						
						if ( i < length ) {
							execute( item[ i++ ] , context , thread , function() {
								iterate( i );
							} );
						} else {
							callback && callback();
						}
						
					} )( 0 );
					
				}
				
			} else {
				
				callback && callback();
			}
		}
	}
}

