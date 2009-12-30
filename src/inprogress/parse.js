var	// Regular expressions
	R_DELIM = /\s+/,
	R_REPLACE = /^(.*)\$([^\${}]*){([^\${}]*)}(.*)$/,
	R_REPLACE_BEGIN = /^(.*)\$([^\${}]*){$/,
	R_REPLACE_END = /^}(.*)$/,
	
	// Syntax error
	STR_SYNTAX_ERROR = "DOMINOES: Syntax Error",
	
	// Symbols
	SYMBOLS = {},
	/** @const */ SYM_WAIT =		1,
	/** @const */ SYM_READY =		2,
	/** @const */ SYM_BEGIN =		3,
	/** @const */ SYM_END =			4,
	/** @const */ SYM_BEGIN_OPT =	5,
	/** @const */ SYM_END_OPT =		6,
	
	// Miscellaneous
	symbolsArray = "0 > >| { } {{ }}".split( R_SPACES ),
	i = symbolsArray.length;

// Initialize symbols
for (; --i ; SYMBOLS[ symbolsArray[ i ] ] = i );

/**
 * Parses a chain
 * @param expression
 * @return array
 */
function parseChain( chain ) {
	
	chain = chain.split( R_DELIM );
	
	var i = 0,
		length = chain.length,
		stack = [],
		root = [],
		current = root,
		tmp,
		item;
	
	current[ STR_PARALLEL ] = TRUE;
	
	for( ; i < length ; i++ ) {
		
		if ( item = chain[ i ] ) {
		
			if ( symbols[ item ] ) {
			
				item = symbols[ item ];
			
				if ( item === SYM_WAIT || item === SYM_READY ) {
					
					if ( item === SYM_READY ) {
						current.push( executeReady );
					}
					
					if ( current.length ) {
						
						tmp = current.splice( 0 , current.length );
						tmp[ STR_PARALLEL ] = current[ STR_PARALLEL ]; 
						current.push( tmp , [] );
						current[ STR_PARALLEL ] = FALSE;
						current = current[ 1 ];
						current[ STR_PARALLEL ] = TRUE;
						
					}
					
				} else if ( item === SYM_BEGIN || item === SYM_BEGIN_OPT ) {
					
					tmp = [];
					current.push( tmp );
					stack.push( current );
					current = tmp;
					current[ STR_PARALLEL ] = TRUE;
					current[ STR_OPTIONAL ] = item === SYM_BEGIN_OPT;
					
				} else if ( item === SYM_END || item === SYM_END_OPT ) {
					
					if ( stack.length ) {
						current = stack.pop();
					} else {
						throw STR_SYNTAX_ERROR;
					}
				}
					
			} else {
			
				current.push( item );
				
			}
		}
		
	}
	
	return root;
}

/**
 * Parse a string item
 */
function parseStringItem( string , context , thread ) {

	var parsed,
		current,
		beforeParts,
		afterParts;
	
	string.replace( R_REPLACE , function( _ , before , name , args , after ) { 
		
		while( parsed === undefined ) {
			current = name
				? functors[ name ].call( context , args , thread )
				: properties[ args.url ? args.url : args ];
			if ( isString( current ) ) {
				current = parse( current , context , thread );
			}
			beforeParts = R_REPLACE_BEGIN.exec( before );
			afterParts = R_REPLACE_END.exec( after );
			if ( ! beforeParts && ! afterParts ) {
				parsed = [ before , current , after ];
			} else if ( beforeParts && afterParts ) {
				before = beforeParts[ 1 ];
				name = beforeParts[ 2 ];
				args = current;
				after = afterParts[ 1 ];
			} else {
				throw STR_SYNTAX_ERROR;
			}
		}
	});
	
	return parsed || {
		url: string
	};
}

/**
 * Parse a string
 * @param string
 * @return
 */
function parse( string , context , thread ) {
	
	var parsed;
	
	if ( R_DELIM.test( string ) ) {
		
		parsed = parseChain( string );
		
	} else if ( parsed = context[ string ] || globals[ string ] ) {
			
		parsed = isString( parsed ) ? parse( parsed , context , thread ) : parsed;
			
	} else {
		
		parsed = parseStringItem( string , context , thread );
			
	}
	
	return parsed;
}

