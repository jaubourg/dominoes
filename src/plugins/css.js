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
				owner,
				parts;
				
			if ( stylesheets ) { // Safeguard for IE
	
				for ( i = 0, length = stylesheets.length; i < length; i++ ) {
					
					if ( ( stylesheet = stylesheets[i] ) // Safeguard for IE
						&& ( title = stylesheet.title )
						&& ( object = cssObjects[title] ) ) {
							
						callback = object.callback;
						link = object.link;
	
						// IE: links have a readyState property, use it
						readyState = link.readyState;
						if ( readyState !== undefined) {
							
							if ( readyState=="loaded" || readyState=="complete" ) {
								callback( stylesheet );
							}
							
						} else {
							
							try {
								
								owner = 1;
								
								stylesheet.cssRules;
								
								// Webkit: stylesheet object is not created before the link has been loaded
								//  * same-domain: cssRules is returned (no exception thrown)
								//  * cross-domain: cssRules is empty (no exception thrown)
								
								// Gecko, Opera: an exception is thrown if the stylesheet hasn't been loaded
								//  * same-domain: if loaded, cssRules is returned, else exception
								//  * cross-domain: always throws an exception
								
								owner = 0;
								
								callback( stylesheet );
								
							} catch(e) {
								
								// Callback threw the exception
								if ( ! owner ) {
									throw e;
								}
								
								// Gecko: the engine throws NS_ERROR_DOM_* exceptions
								
								if ( /NS_ERR/.test(e) ) {
									
									// Once loaded, a more specific NS_ERROR_DOM_SECURITY_ERR is thrown
									// for cross-domain links
									
									if ( /SECURITY/.test(e) ) {
	
										callback( stylesheet );
									
									}
								
								} else {
									
									// Opera
									
									// Determine if the request is cross domain
									if ( object.x === undefined ) {
										// Some jQuery pillage
										parts = /^(\w+:)?\/\/([^\/?#]+)/.exec( link.href );
										object.x = !!( parts && ( parts[ 1 ] && parts[ 1 ] != location.protocol || parts[ 2 ] != location.host ) );
									}
									
									// If cross domain
									if ( object.x ) {
										try {
	
											stylesheet.deleteRule( 0 );
											
											// If the link hasn't been loaded yet, deleteRule is ignored by Opera
											// but once loaded, it throws a security exception
											
										} catch(_) { 
											
											callback( stylesheet );
											
										}
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
					callback();
				}	
			};
			
			if ( ! cssPollingNb++ ) {
				cssTimerId = setInterval( cssGlobalPoller , 13 );
			}
			
		};

} )( dominoes );