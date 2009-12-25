var // List of plugins
	plugins = {};
	
dominoes.plugin = function( id , functor ) {
	
	var length = arguments.length;
	
	if ( length > 1 ) {
		
		if ( functor === FALSE ) {
			
			if ( plugins[ id ] ) {
				
				delete plugins[ id ];
			
			}
		
		} else if ( isFunction( functor ) ) {
			
			plugins[ id ] = functor;
			
		}
		
	} else if ( id === FALSE ) {
		
		plugins = {};
		
	} else if ( length ) {
		
		return plugins[ id ];
		
	}
	
	return this;
	
};

function pluginFilter( options ) {
	
	var functor;
	
	options.url = options.url.replace( /^\$([^{]+){(.*)}$/ , function( _ , name , url ) {
		
		functor = plugins[ name ] || function() {
			return noOp;
		};
		return url;
		
	} );
	
	return functor ? functor( pluginFilter(options) ) : options;
	
}

