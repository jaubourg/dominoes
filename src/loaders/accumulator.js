function accumulator( functor ) {
	
	var callbacks = {},
		launched = FALSE;
	
	return loader ( function( options , callback ) {
		
		callbacks[ options[ STR_URL ] ] = callback;
		
		if ( ! launched ) {
			
			launched = TRUE;
			
			later( function() {
				
				var array = [],
					string,
					_callbacks = callbacks;
				
				callbacks = {};
				launched = FALSE;
				
				for ( string in _callbacks ) {
					array.push( string );
				}
				
				array.sort();
				
				execute( functor( array ) , {} , {} , function() {
					for ( string in _callbacks ) {
						_callbacks[ string ]();
					}
				} );
				
			} );
			
		}
		
	} );
	
}

