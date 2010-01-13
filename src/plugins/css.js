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
			
			var link = document.createElement("link");
				charset = options.charset;
	
			link.rel = "Stylesheet";
			link.type = "text/css";
			link.href = url;
				
			if ( charset ) {
				link.charset = charset;
			}
			
			// Watch the link
			cssWatch( link , callback , options.title );
			
			// Add it to the doc
			( document.getElementsByTagName("head")[0] || document.documentElement ).appendChild( link );
			
			// Opera safeguard:
			// for same-domain stylesheets, we create a rule to control if the stylesheet has been properly loaded
			try {
				var stylesheets = document.styleSheets,
					stylesheet,
					title,
					i = 0,
					length = stylesheets.length;
					
				for ( ; i < length ; i++ ) {
					
					if ( stylesheet = stylesheets[ i ] ) {
						
						if ( ! stylesheet.insertRule ) break;
						
						if ( ( title = stylesheet.title ) == link.title ) {
							stylesheet.insertRule(title+"{a:0}",0);
							break;
						}
					}
				}
				
			} catch(e) {}
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
	
	var	// Next css id
		cssPollingId = ( new Date() ).getTime(),
		
		// Number of css being polled
		cssPollingNb = 0,
		
		// Polled css
		cssObjects = {},
		
		// Main poller function
		cssGlobalPoller = function() {
	
			var object,
				callback,
				link,
				stylesheet,
				stylesheets = document.styleSheets,
				title,
				i,
				length,
				readyState,
				rules;
				
			if ( stylesheets ) { // Safeguard for IE
				
				for ( i = 0, length = stylesheets.length; i < length; i++ ) {
					
					if ( ( stylesheet = stylesheets[i] ) // Safeguard for IE
						&& ( title = stylesheet.title )
						&& ( object = cssObjects[title] ) ) {
							
						callback = object.callback;
						link = object.link;
						
						// Internet Explorer:
						//  * links have a readyState property, we use it
						readyState = link.readyState;
						if ( readyState !== undefined) {
							
							if ( readyState=="loaded" || readyState=="complete" ) {
								callback( stylesheet );
							}
							
						} else {
							
							try {
								
								rules = stylesheet.cssRules;
								
								// Webkit:
								// Stylesheet object is not created before the link has been loaded
								//  * same-domain: cssRules is returned (no exception thrown)
								//  * cross-domain: cssRules is empty (no exception thrown)
								
								// Gecko:
								// An exception is thrown if the stylesheet hasn't been loaded
								//  * same-domain: if loaded, cssRules is returned, else exception
								//  * cross-domain: always throws an exception
								
								// Opera:
								//  * same-domain: loaded or not, cssRules is returned
								//  * cross-domain: always throws an exception
								
								// Opera safeguard
								if ( rules.length === 1 && rules[0].selectorText == title ) {
									continue;
								}
								
								callback( stylesheet );
								
							} catch(e) {
								
								// Gecko: the engine throws NS_ERROR_DOM_* exceptions
								if ( /NS_ERR/.test(e) ) {
									
									// Once loaded, a more specific NS_ERROR_DOM_SECURITY_ERR is thrown
									// for cross-domain links
									
									if ( /SECURITY/.test(e) ) {
	
										callback( stylesheet );
									
									}
								
								// Opera (cross-domain)
								} else {
									
									try {

										stylesheet.deleteRule( 0 );
										
										// If the link hasn't been loaded yet, deleteRule is ignored by Opera
										// but once loaded, it throws an exception
										
									} catch(_) { 
										
										callback( stylesheet );
										
									}
								}
							}
						}
					}
				}
			}
		},
		
		// Watch stylesheet loading (based on a timer)
		cssTimerId,
		
		cssWatch = function ( link , callback , finalTitle ) {
			
			var title = link.title = "_domcss_" + cssPollingId++;
			
			cssObjects[title] = {
	
				link: link,
				
				callback: function( stylesheet ) {
					delete cssObjects[ title ];
					if ( ! --cssPollingNb ) {
						clearInterval( cssTimerId );
					}
					if ( finalTitle ) {
						link.title = stylesheet.title = finalTitle;
					}
					dominoes.later( callback );
				}	
			};
			
			if ( ! cssPollingNb++ ) {
				cssTimerId = setInterval( cssGlobalPoller , 13 );
			}
			
		};

} )( dominoes );