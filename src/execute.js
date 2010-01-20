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
			callback = noop;
		}

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
				
				loadScript( item , callback );
					
			} else {
				
				execute( url , context , thread , callback );
				
			}
			
		} else if ( isFunction( item ) ) {
			
			if ( item.call( context , callback , thread ) !== FALSE ) {
				callback();
			}
		
		} else if ( isArray( item ) && ( length = item[ STR_LENGTH ] ) ) {
			
			if ( item[ STR_PARALLEL ] ) {
				
				var i = 0,
					num = length;
		
				while ( i < length ) {
					
					execute( item[ i++ ] , context , thread , function() {
						
						if ( ! --num ) {
							callback();
						}
						
					} );
					
				}
				
			} else {
			
				( function iterate( i ) {
					
					if ( i < length ) {
						execute( item[ i++ ] , context , thread , function() {
							iterate( i );
						} );
					} else {
						callback();
					}
					
				} )( 0 );
				
			}
			
		} else {
			
			callback();
			
		}
		
	} else {
		
		callback();
		
	}
}

