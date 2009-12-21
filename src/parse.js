var	// Symbols
	symbolsArray = "0 > >| { } {{ }}".split( rspaces ),
	symbols = {},
	/** @const */ s_wait =		1,
	/** @const */ s_ready =		2,
	/** @const */ s_begin =		3,
	/** @const */ s_end =		4,
	/** @const */ s_beginOpt =	5,
	/** @const */ s_endOpt =	6,
	
	// Misc
	i = symbolsArray.length;

// Init symbols
for (; --i ; symbols[ symbolsArray[ i ] ] = i );

// Normalizes a sequence
// - remove unnecessary sync symbols
// - flatten sub-sequences where possible
function normalizeSequence( inputSequence , optional ) {

	var outputSequence = [],
		sub,
		lastSub,
		readyCount = 0,
		waitCount = 0,
		previousItem,
		item;
		
	while ( inputSequence.length && ( item = inputSequence.shift() ) !== s_end && item !== s_endOpt ) {
		
		sub = undefined;

		if ( isArray( item ) ) {
			
			sub = normalizeSequence ( item );
		
		} else if ( item === s_begin ) {

			sub = normalizeSequence ( inputSequence );

		} else if ( item === s_beginOpt ) {

			sub = normalizeSequence ( inputSequence , TRUE );
		
		}
		
		if ( sub ) {
			
			if ( sub.sequence.length ) {
				
				if ( ( ! sub.blocking )
					&& ( sub.optional ? optional : TRUE ) ) {
					
					sub.sequence.push( previousItem = sub.sequence.pop() );
					outputSequence.push.apply( outputSequence , sub.sequence );
					
				} else {
				
					sub.sequence.push( !!sub.optional );
					outputSequence.push( previousItem = sub.sequence );
					lastSub = ( sub.optional ? optional : TRUE) ? sub : undefined;
			
				}
				
			}
			
		} else {
			
			if ( item == s_wait ) {
				
				if ( previousItem === s_wait || previousItem === s_ready ) {
					continue;
				} else {
					waitCount++;
				}
			
			} else if ( item === s_ready ) {
				
				if ( previousItem === s_ready ) {
					continue;
				} else if ( previousItem === s_wait ) {
					outputSequence.pop();
					waitCount--;
				}
				 
				readyCount++;
			}
			
			outputSequence.push( previousItem = item );
			
		}
	}
	
	if ( previousItem == s_wait ) {
		outputSequence.pop();
		waitCount--;
	}
	
	if ( outputSequence.length == waitCount ) {
		outputSequence = [];
		waitCount = readyCount = 0;
	}
	
	if ( outputSequence.length == 1 && lastSub ) {
		
		lastSub.sequence.pop();
		return lastSub;
		
	}
	
	if ( lastSub && outputSequence[ outputSequence.length - 1 ] === lastSub.sequence ) {
		
		outputSequence.pop();
		lastSub.sequence.pop();
		outputSequence.push.apply( outputSequence , lastSub.sequence );
		
	}
	
	return {
		sequence: outputSequence,
		optional: optional,
		blocking: waitCount + readyCount
	};
}

// Transforms a sequence string expression into a sequence
function parseChain( chain , context ) {
	
	var list = [],
		i,
		length,
		item;
		
	chain = chain.split( rspaces );
	
	for ( i = 0 , length = chain.length ; i < length ; i++ ) {
		if ( item = chain[i] ) {
			list.push( context[ item ] || item );
		}
	}

	return parseList( list , context , FALSE );
}

// Parse a list of arguments into a sequence
function parseList( list , context , sequential ) {
	
	var sequence = [],
		topLevel = arguments.length === 1,
		context = topLevel ? {} : context,
		sequential = topLevel ? TRUE : sequential,
		i,
		length,
		item,
		symbol;
	
	for ( i = 0 , length = list.length ; i < length ; i++ ) {
		
		if ( item = list[ i ] ) {
            
			if ( isString( item ) ) {

				symbol = symbols[ item ];

				if ( ! symbol && rspaces.test( item ) ) {
					
					sequence.push( parseChain( item , context ) );
				
				} else {
					
					sequence.push( symbol || item );
				
				}
				
			} else if ( isString( item.chain ) ) {
				
				sequence.push ( parseChain( item.chain , item ) );
				
			} else if ( isArray( item ) ) {
				
				sequence.push ( parseList( item , context , TRUE ) );
				
			} else if ( isFunction( item ) ) {
				
				sequence.push((function() {
					var method = item;
					return function( callback ) {
						return method.call( context , callback );
					}
				})());
				
			} else {
				
				sequence.push( item );
				
			}
		
			// We wanna add sync for sequential automagically
			if ( sequential ) {
				sequence.push( s_wait );
			}
		}
		
	}
	
	// For top level
	if ( topLevel && sequence.length ) {
		// We handle subExpressions
		sequence = ( normalizeSequence( sequence ) ).sequence;
	}
	
	return sequence;
}

