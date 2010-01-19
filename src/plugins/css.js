/*
 * Dominoes JavaScript Library v.@VERSION
 *
 * CSS plugin
 *
 * Copyright 2010, Julian Aubourg
 * Dual licensed under the MIT and GPL Version 2 licenses
 *
 * Date: @DATE
 */
( function( dominoes ) {
	
	var loaded = {},
		loading = {};

	dominoes.functor( "css{O}" , function( options ) {
		
		function load( url , callback ) {
			
			var link = document.createElement("link"),
				charset = options.charset,
				title = options.title;
	
			link.rel = "stylesheet";
			link.type = "text/css";
			link.media = options.media || "screen";
			link.href = url;
				
			if ( charset ) {
				link.charset = charset;
			}
			
			// Watch the link
			cssPoll( link , function() {
				
				cssUnpoll( link );
				
				if ( title ) {
					link.title = title;
				}
				
				callback();
			} );
			
			// Add it to the doc
			( document.getElementsByTagName("head")[0] || document.documentElement ).appendChild( link );
			
		}
			
		return function( callback ) {
			
			var url = options.url,
				callbacks;
				
			if ( options.cache === false ) {
				
				url += ( /\?/.test( url ) ? "&" : "?" ) + "_=" + (new Date()).getTime();
				load( url , callback );
				
			} else if ( loaded[ url ] ) {
				
				callback();
				
			} else if ( callbacks = loading[ url ] ) {
				
				callbacks.push( callback );
				
			} else {
				
				callbacks = loading[ url ] = [ callback ];
				load( url , function() {
					
					while( callbacks.length ) {
						( callbacks.shift() )();
					}
					
					delete loading[ url ];
					
					loaded[ url ] = true;
				} );
				
			}
			
			return false;
		}
		
	} );
	
	var // Number of css being polled
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
				
			for ( i = 0 , length = stylesheets.length ; i < length ; i++ ) {
				
				stylesheet = stylesheets[ i ];
				
				if ( ( href = stylesheet.href )
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
			if ( link.readyState ) {
				
				link.onreadystatechange = function() {
					
					var readyState = link.readyState;
					
					if ( readyState === "complete" || readyState === "loaded" ) {
						callback();
					}
				};
			
			// If onload is available, use it
			} else if ( link.onload === null /* exclude Webkit => */ && link.all ) {
				
				link.onload = callback;
				
			// In any other browser, we poll
			} else {
				
				cssCallbacks[ link.href ] = callback;
				
				if ( ! cssPollingNb++ ) {
					cssTimer = setInterval( cssGlobalPoller , 13 );
				}
				
			}
			
		},
		cssUnpoll = function ( link ) {
			
			if ( cssCallbacks[ link.href ] ) {
				
				delete cssCallbacks[ link.href ];
				
				if ( ! --cssPollingNb ) {
					clearInterval( cssTimer );
				}
				
			} else {
				
				link.onload = link.onreadystatechange = null;
				
			}
			
		};

} )( dominoes );