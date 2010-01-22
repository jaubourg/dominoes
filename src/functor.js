var // Predefined functors
	predefinedFunctors = {},
	
	// Make predefined
	predefinedFunctor = function( name , types , action ) {
		
		functor( name + "{" + types + "}" , function( arg ) {
			
			return function( callback ) {
				
				action( arg , callback );
				return FALSE;
				
			}
			
		} );
		
		predefinedFunctors[ name ] = functor( name );
		
		functor( name , FALSE );
		
	},

	// Declare a functor
	functor = dominoes.functor = dataHolder( function( id , func ) {
	
		var parts = /^\s*([^\${}]+)({(\s|S|O|F|\+|\|)*})?\s*$/.exec( id );
		
		if ( parts ) {
				
			if ( isFunction( func ) ) {
			
				var functors = this,
					id = parts[ 1 ],
					functor = functors[ id ] = functors[ id ] || function( _data , thread ) {
						
						var data = _data,
							context = this;
	
						if ( data ) {
							
							if ( types[ STR_PLUS ] && isString( data ) ) {
								
								if ( types[ STR_PLUS ] !== plus ) {
									plus = types[ STR_PLUS ];
									accu = accumulator( plus );
								}
								
								data = function( callback ) {
									accu( { url : _data } , callback );
									return FALSE;
								};
								
							} else if ( isString( data ) && ( types.S || types.O ) ) {
								
								if ( types.S ) {
	
									data = types.S.call( context , data , thread );
								
								} else if ( types.O ) {
	
									data = types.O.call( context , { url : data } , thread );
								
								}
							
							} else if ( data.url && types.O ) {
								
								data = types.O.call( context , data , thread );
							
							} else if ( types.F ) {
								
								data = types.F.call( context , isFunction( data ) ? data : function ( callback , thread ) {
									execute( _data , this , thread , callback );
									return FALSE;
								} , thread );
							
							}
							
						}
						
						return data;
						
					},
					accu = functor.A,
					types = functor.T = functor.T || {},
					plus = types[ STR_PLUS ],
					typesString = parts[ 2 ] ? parts[ 2 ].replace( /^{\s*|\s*}$/g , "" ) : "",
					tmp = ( typesString || "F|S|O" ).split( /\s*\|\s*/ ),
					length = tmp[ STR_LENGTH ],
					i = 0;
					
				for ( ; i < length ; i++ ) {
					types[ tmp[ i ] ] = func;
				}
					
			}
			
		}
		
	} );

