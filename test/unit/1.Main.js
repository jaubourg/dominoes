module("Main");

test("Function", function() {
	
	expect( 1 );
	
    dominoes( function() {
		ok( true , "function called");
	} );
	
});

test("Definition", function() {
	
	expect(2);
	
    dominoes( {
    	
    	chain: "first second",
    	
    	first: function() {
    		ok( true , "first method called");
    	},
    	
    	second: function() {
    		ok( true , "second method called");
    	}
    	
	} );
	
});

test("Serial execution" , function() {
	
	expect( 1 );
	
	stop();
	
	var string = "";
		
	dominoes( {
		
		chain: "first > second",
		
		first: function(callback) {
			setTimeout( function() {
				string += "first ";
				callback();
			}, 100);
			return false;
		},
		
		second: function() {
			string += "second";
		}
		
	}, function() {
		
		strictEqual( string , "first second" , "first method did block the second one" );
		start();
		
	});
	
});

test("Parallel execution" , function() {
	
	expect( 1 );
	
	stop();
	
	var string = "";
	
	dominoes( {
		
		chain: "first second",
		
		first: function(callback) {
			setTimeout( function() {
				string += " first";
				callback();
			}, 100);
			return false;
		},
		
		second: function() {
			string += "second";
		}
		
	}, function() {
		
		strictEqual( string , "second first" , "first method didn't block the second one" );
		start();
		
	});
	
});

test("Non blocking sub-expression" , function() {
	
	expect( 2 );
	
	stop();
	
	var string = "";
	
	dominoes( {
		
		chain: "(( first > restart )) second > third",
		
		first: function(callback) {
			setTimeout( function() {
				string += " first";
				callback();
			}, 100);
			return false;
		},
		
		second: function() {
			string += "second";
		},
		
		third: function() {
			string += " third";
		},
		
		restart: function() {
			strictEqual( string , "second third first" , "first method did block its sub-chain" );
			start();
		}
		
	}, function() {
		
		strictEqual( string , "second third" , "first method didn't block the main chain" );
		
	});
	
});

test("Multiple arguments", function() {
	
	expect( 2 );
	
	var i = 0;
	
    dominoes( function() {
    		equal( ++i , 1 , "first function called first");
    } , function() {
    		equal( ++i , 2 , "second function called second");
    });
	
});

test("Array" , function() {
	
	expect( 2 );
	
	var i = 0;
	
    dominoes( [ function() {
    		equal( ++i , 1 , "first function called first");
    },function() {
    		equal( ++i , 2 , "second function called second");
    } ] );
	
});

test("URL" , function() {
	
	expect( 1 );
	
	window.DOMINOES_UNIT_STRING = "";
	
	stop();
	
	dominoes( url ( "./data/concat.php?str=A&wait=200" ) , function() {
		equal( window.DOMINOES_UNIT_STRING , "A" , "URL has been loaded" );
		start();
	});
	
});

test("URL (cache)" , function() {
	
	expect( 2 );
	
	window.DOMINOES_UNIT_STRING = "";
	
	stop();
	
	var i, list;
	
	for ( i = 0 , list = [] ; i < 20 ; i++ ) {
		list.push( "./data/concat.php?str=URL_CACHE_TEST&wait=200" );
	}
	
	list.push( function() {
		equal( window.DOMINOES_UNIT_STRING , "URL_CACHE_TEST" , "URL has been loaded only once" );
		dominoes( "./data/concat.php?str=URL_CACHE_TEST&wait=200" , function() {
			equal( window.DOMINOES_UNIT_STRING , "URL_CACHE_TEST" , "Cache is consistant amongst calls" );
			start();
		} );
	} );
	
	dominoes( list );	
	
});

test("URL (options object)" , function() {
	
	expect( 1 );
	
	window.DOMINOES_UNIT_STRING = "";
	
	stop();
	
	dominoes( {
		
		url : url ( "./data/concat.php?str=A&wait=200" )
		
	} , function() {
		equal( window.DOMINOES_UNIT_STRING , "A" , "URL has been loaded" );
		start();
	} );
	
});

test("URL (options object with cache = false)" , function() {
	
	expect( 2 );
	
	window.DOMINOES_UNIT_STRING = "";
	
	stop();
	
	dominoes( {
		
		url : "./data/concat.php?str=NO_CACHE&wait=100" ,
		cache : false
		
	} , function() {
		
		equal( window.DOMINOES_UNIT_STRING , "NO_CACHE" , "URL has been loaded once" );
		
	} , {
		
		url : "./data/concat.php?str=NO_CACHE&wait=100" ,
		cache : false
		
	} , function() {
		
		equal( window.DOMINOES_UNIT_STRING , "NO_CACHENO_CACHE" , "URL has been loaded twice" );
		start();
		
	} );
	
});

test("Function with callback handling", function() {
	
	expect( 3 );
	
	stop();
	
	var i = 0;
	
    dominoes( function( callback ) {
    		equal( ++i , 1 , "first function called first");
    		setTimeout( function() {
    			equal( ++i , 2 , "execution is still blocked");
    			callback();
    		}, 200);
    		return false;
    } , function() {
    		equal( ++i , 3 , "second function called after callback");
    		start();
    });
	
});

test("Definition context", function() {
	
	expect( 2 );
	
    dominoes( {
    	
    	chain: "first > second",
    	
    	first: function() {
    		equal( this.chain , "first > second" , "first method is in context" );
    		this.string = "Hello world";
    	},
    	
    	second: function() {
    		equal( this.string , "Hello world" , "second method is in context");
    	}
    	
	} );
	
});

test("Definition context (recursive)", function() {
	
	expect( 2 );
	
    dominoes( {
    	
    	chain: "subChain",
    	
    	subChain: "first > second",
    	
    	first: function() {
    		equal( this.chain , "subChain" , "first method is in context" );
    		this.string = "Hello world";
    	},
    	
    	second: function() {
    		equal( this.string , "Hello world" , "second method is in context");
    	}
    	
	} );
	
});

test("Dom readyness detection" , function() {
	
	expect( 2 )
	
	stop();
	
	window.notifyFrameReady = function( text , duration ) {
		strictEqual( text , "WORLD" , "Document was ready" );
		ok( duration > 1000 , "Polling occured (" + duration / 1000 + " seconds)" );
		start();
	};
	
	var iframe = document.createElement("iframe");

	iframe.src = url( "data/readyTest.php" );
		
	( document.getElementsByTagName("head")[ 0 ] || document.documentElement ).appendChild( iframe );
	
});