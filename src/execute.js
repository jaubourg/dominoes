var loaded = {},
	loading = {};
	
/**
 * Executes an item
 * @param item the item to be executed
 * @param context the context of the item
 * @param thread current running thread
 * @param callback function to be called once finished
 */
function execute( item , context , thread , callback ) {
	
	var url,
		length;
	
	if ( item ) {
		
		if ( item[ STR_OPTIONAL ] && callback ) {
			callback();
			callback = undefined;
		}

		context = context || {};
		thread = thread || {};
		
		if ( item[ STR_CHAIN ] ) {
			context = item;
			item = item[ STR_CHAIN ];
		}
		
		if ( item[ STR_URL ] ) {
			
			url = item[ STR_URL ];
			
		} else if ( isString( item ) ) {
			
			url = item;
			
		}
		
		if ( url ) {
			
			url = parse( url , context , thread );
			
			if ( isString( url ) ) {
				
				if ( isString( item ) ) {
					
					item = {
						url: url
					};
					
				} else {
					
					item[ STR_URL ] = url;
					
				}
				
				if ( item[ STR_CACHE ] === FALSE ) {
				
					loadScript( item , callback || noOp );
					
				} else if ( loaded[ url ] ) {
					
					callback && callback();
					
				} else if ( loading[ url ] ) {
					
					if ( callback ) {
						loading[ url ].push( callback );
					}
					
				} else {
					
					loading[ url ] = [];
					
					if ( callback ) {
						loading[ url ].push( callback );
					}
					
					loadScript( item , function() {
						while( loading[ url ].length ) {
							( loading[ url ].shift() )();
						}
						loaded[ url ] = TRUE;
						delete loading[ url ];
					} );
					
				}
				
			} else {
				
				execute( url , context , thread , callback );
				
			}
			
		} else if ( isFunction( item ) ) {
			
			if ( item.call( context , callback || noOp , thread ) !== FALSE ) {
				callback && callback();
			}
		
		} else if ( isArray( item ) && ( length = item.length ) ) {
			
			if ( item[ STR_PARALLEL ] ) {
				
				var i = 0,
					num = length,
					barrier = callback ? function() {
						if ( ! --num ) {
							callback();
						}
					} : undefined ;
		
				while ( i < length ) {
					execute( item[ i++ ] , context , thread , barrier );
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
		
	} else {
		
		callback && callback();
		
	}
}

