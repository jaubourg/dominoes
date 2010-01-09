var functor = dominoes.functor = dataHolder( function( id , func ) {
	
	var parts = /^\s*([^\${}]+)({(\s|S|O|F|\|)*})?\s*$/.exec( id );
	
	if ( parts ) {
			
		if ( isFunction( func ) ) {
		
			var functors = this,
				id = parts[ 1 ],
				functor = functors[ id ] = functors[ id ] || function( _data , thread ) {
					
					var data = _data,
						context = this;

					if ( data ) {
						
						if ( isString( data ) && ( types.S || types.O ) ) {
							
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
				types = functor.T = functor.T || {},
				typesString = parts[ 2 ] ? parts[ 2 ].replace( /^{\s*|\s*}$/g , "" ) : "",
				tmp = ( typesString || "F|S|O" ).split( /\s*\|\s*/ ),
				length = tmp.length,
				i = 0;
				
			for ( ; i < length ; i++ ) {
				types[ tmp[ i ] ] = func;
			}
				
		}
		
	}
	
} );

