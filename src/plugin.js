var // List of plugins
	plugins = {};
	
dominoes.plugin = function( name , functor ) {
	
	var length = arguments.length;
	
	if ( length > 1 ) {
		
		if ( functor === false ) {
			
			try {
				
				delete plugins[ name ];
			
			} catch( _ ) {}
		
		} else if ( isFunction( functor ) ) {
			
			plugins[ name ] = functor;
			
		}
		
	} else if ( length ) {
		
		return plugins[ name ];
		
	} else {
		
		plugins = {};
		
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

