// Generic functor holder callback
function functorHolderCallback( _id , func ) {

	var parts = /^([^$()]+)(?:\(([|SOF+]*)\))?$/.exec( _id );
	
	if ( parts ) {
			
		if ( isFunction( func ) ) {
		
			var functors = this,
				id = parts[ 1 ],
				functor = functors[ id ] = functors[ id ] || function( _data , thread ) {
					
					var data = _data,
						context = this;

					if ( data ) {
						
						if ( subFunctors[ STR_PLUS ] && isString( data ) ) {
							
							if ( subFunctors[ STR_PLUS ] !== plus ) {
								plus = subFunctors[ STR_PLUS ];
								accu = accumulator( plus );
							}
							
							data = function( callback ) {
								accu( { url : _data } , callback );
								return FALSE;
							};
							
						} else if ( isString( data ) && ( subFunctors.S || subFunctors.O ) ) {
							
							if ( subFunctors.S ) {

								data = subFunctors.S[ STR_CALL ]( context , data , thread );
							
							} else if ( subFunctors.O ) {

								data = subFunctors.O[ STR_CALL ]( context , { url : data } , thread );
							
							}
						
						} else if ( data.url && subFunctors.O ) {
							
							data = subFunctors.O[ STR_CALL ]( context , data , thread );
						
						} else if ( subFunctors.F ) {
							
							data = subFunctors.F[ STR_CALL ]( context , isFunction( data ) ? data : function ( callback , thread ) {
								execute( _data , this , thread , callback );
								return FALSE;
							} , thread );
						
						}
						
					}
					
					return data;
					
				},
				accu = functor.A,
				subFunctors = functor.S = functor.S || {},
				plus = subFunctors[ STR_PLUS ],
				types = ( parts[ 2 ] || "F|S|O" ).split( /\|/ ),
				i = types[ STR_LENGTH ];
				
			while( i-- ) {
				subFunctors[ types[ i ] ] = func;
			}
				
		}
		
	}
	
}

var // Declare a functor
	functor = dominoes.functor = dataHolder( functorHolderCallback ),
	
	// Declare a predefined functor
	predefined = dataHolder( function( id , func ) {
		
		functorHolderCallback[ STR_CALL ]( this , id , function( data ) {
			
			return function( callback ) {
				func( data , callback );
				return FALSE;
			}
			
		} );
		
	} );

