function pollFunction() {
	
	var tmp = [],
		args;
	
	while( pollTasks[ STR_LENGTH ] ) {
		
		args = pollTasks.shift();
		
		try {
		
			if ( args[0].apply( slice.call( args , 1 ) ) !== TRUE ) {
				
				tmp.push( args );
				
			}
			
		} catch ( _ ) {}
	}
		
	pollTasks = tmp;
	
	if ( ! pollTasks[ STR_LENGTH ] ) {
		
		clearInterval( pollTimer );
		
	}
	
}

var pollTimer,
	pollTasks = [],
	poll = dominoes.poll = function() {
		
		if ( isFunction( arguments[ 0 ] ) ) {
			
			if ( ! pollTasks[ STR_LENGTH ] ) {
				pollTimer = setInterval( pollFunction , 13 );
			}
			
			pollTasks.push( arguments );
		}
	};
	
