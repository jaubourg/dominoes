var loadStyleSheet = loader( function( options , callback ) {
		
		var link = document[ STR_CREATE_ELEMENT ]("link");
	
		link.rel = "stylesheet";
		link.type = "text/css";
		link.media = options.media || "screen";
		link[ STR_HREF ] = options[ STR_URL ];
			
		if ( options[ STR_CHARSET ] ) {
			link[ STR_CHARSET ] = options[ STR_CHARSET ];
		}
		
		// Watch the link
		cssPoll( link , function() {
			
			cssUnpoll( link );
			
			if ( options.title ) {
				link.title = options.title;
			}
			
			callback();
		} );
		
		// Add it to the doc
		head.appendChild( link );
	
	} ),

	// Number of css being polled
	cssPollingNb = 0,
	
	// Polled css callbacks
	cssCallbacks = {},
	
	// Main poller function
	cssGlobalPoller = function () {
		
		var callback,
			stylesheet,
			stylesheets = document.styleSheets,
			href,
			i,
			length;
			
		for ( i = 0 , length = stylesheets[ STR_LENGTH ] ; i < length ; i++ ) {
			
			stylesheet = stylesheets[ i ];
			
			if ( ( href = stylesheet[ STR_HREF ] )
				&& ( callback = cssCallbacks[ href ] ) ) {
					
				try {
					
					stylesheet.cssRules;
					
					// Webkit:
					// Webkit browsers don't create the stylesheet object
					// before the link has been loaded.
					// When requesting rules for crossDomain links
					// they simply return nothing (no exception thrown)
					
					// Gecko:
					// NS_ERROR_DOM_INVALID_ACCESS_ERR thrown if the stylesheet is not loaded
					// If the stylesheet is loaded:
					//  * no error thrown for same-domain
					//  * NS_ERROR_DOM_SECURITY_ERR thrown for cross-domain
					
					callback();
				
				} catch(e) {
					
					// Gecko:
					// catch NS_ERROR_DOM_SECURITY_ERR
					if ( /SECURITY/.test( e ) ) {
						callback();
					}
				}
			}
		}
	},
	
	// Poll / Unpoll
	cssPoll = function ( link , callback ) {
		
		// onreadystatechange
		if ( link[ STR_READY_STATE ] ) {
			
			link[ STR_ON_READY_STATE_CHANGE ] = function() {
				
				var readyState = link[ STR_READY_STATE ];
				
				if ( readyState === "complete" || readyState === "loaded" ) {
					callback();
				}
			};
		
		// If onload is available, use it
		} else if ( link[ STR_ON_LOAD ] === null /* exclude Webkit => */ && link.all ) {
			
			link[ STR_ON_LOAD ] = callback;
			
		// In any other browser, we poll
		} else {
			
			cssCallbacks[ link[ STR_HREF ] ] = callback;
			
			if ( ! cssPollingNb++ ) {
				cssTimer = setInterval( cssGlobalPoller , 13 );
			}
			
		}
		
	},
	cssUnpoll = function ( link ) {
		
		if ( cssCallbacks[ link[ STR_HREF ] ] ) {
			
			delete cssCallbacks[ link[ STR_HREF ] ];
			
			if ( ! --cssPollingNb ) {
				clearInterval( cssTimer );
			}
			
		} else {
			
			link[ STR_ON_LOAD ] = link[ STR_ON_READY_STATE_CHANGE ] = null;
			
		}
		
	};

// Create the associated predefined functor
predefinedFunctor( "css" , "O" , loadStyleSheet );

