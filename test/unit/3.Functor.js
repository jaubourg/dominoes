module("Functor");

test("Undefined", function() {
	
	strictEqual( dominoes.functor("non-existing") , undefined , "Undefined was returned" );
	
});

test("Deleting" , function() {
	
	dominoes.functor( "toDelete" , noOp );
	dominoes.functor( "toDelete" , false );
	
	strictEqual( dominoes.functor( "toDelete" ) , undefined , "Functor has been deleted" );
	
});

test("Setting / retrieving", function() {
	
	strictEqual ( dominoes.functor( "test" , noOp ) , dominoes , "Setting a functor returns dominoes" );
	strictEqual ( dominoes.functor( "test" ).S.F , noOp , "The functor was properly stored for Functions" );
	strictEqual ( dominoes.functor( "test" ).S.S , noOp , "The functor was properly stored for Strings" );
	strictEqual ( dominoes.functor( "test" ).S.O , noOp , "The functor was properly stored for Options" );
	strictEqual ( dominoes.functor( "test" ).S["+"] , undefined , "The functor was not stored for Accumulator" );

	dominoes.functor( false );
	
});

test("Setting / retrieving (typed)", function() {
	
	strictEqual ( dominoes.functor( "test(F|S)" , noOp ) , dominoes , "Setting a functor returns dominoes" );
	strictEqual ( dominoes.functor( "test" ).S.F , noOp , "The functor was properly stored for Functions" );
	strictEqual ( dominoes.functor( "test" ).S.S , noOp , "The functor was properly stored for Strings" );
	strictEqual ( dominoes.functor( "test" ).S.O , undefined , "The functor was not stored for Options" );
	
	dominoes.functor( false );

});

test("Setting / retrieving (typed with no value)", function() {
	
	strictEqual ( dominoes.functor( "test()" , noOp ) , dominoes , "Setting a functor returns dominoes" );
	strictEqual ( dominoes.functor( "test" ).S.F , noOp , "The functor was properly stored for Functions" );
	strictEqual ( dominoes.functor( "test" ).S.S , noOp , "The functor was properly stored for Strings" );
	strictEqual ( dominoes.functor( "test" ).S.O , noOp , "The functor was properly stored for Options" );
	strictEqual ( dominoes.functor( "test" ).S["+"] , undefined , "The functor was not stored for Accumulator" );
	
	dominoes.functor( false );

});

test("Setting / retrieving (accumulator)", function() {
	
	strictEqual ( dominoes.functor( "test(+)" , noOp ) , dominoes , "Setting a functor returns dominoes" );
	strictEqual ( dominoes.functor( "test" ).S["+"] , noOp , "The functor was properly stored for Accumulator" );

	dominoes.functor( false );
	
});

test("Empty list" , function() {
	
	dominoes.functor( "NAME1" , noOp );
	dominoes.functor( "NAME2" , noOp );
	
	dominoes.functor( false );
	
	strictEqual( dominoes.functor( "NAME1" ) , undefined , "Functor 1 has been deleted" );
	strictEqual( dominoes.functor( "NAME2" ) , undefined , "Functor 2 has been deleted" );
	
});

test("Only functions" , function() {
	
	dominoes.functor( "TEST" , "hello" );
	
	strictEqual( dominoes.functor( "TEST" ) , undefined , "Functor wasn't stored" );
	
	dominoes.functor( false );
	
});

test("Called" , function() {
	
	expect( 1 );
	
	stop();
	
	var called;
	
	dominoes.functor( "test" , function() {
		
		called = true;
		
		return noOp;
		
	});
	
	dominoes( "$test(TEST)" , function() {
		
		strictEqual( called , true , "Functor was called" );
		dominoes.functor( false );
		start();
		
	});
	
});

test("URL passed" , function() {
	
	expect( 1 );
	
	stop();
	
	var url;
	
	dominoes.functor( "test" , function( str ) {
		
		url = str;
		
		return noOp;
		
	});
	
	dominoes( "$test(TEST)" , function() {
		
		strictEqual( url , "TEST" , "Option object was passed" );
		dominoes.functor( false );
		start();
		
	});
	
});

test("Filter options" , function() {
	
	expect( 1 );
	
	stop();
	
	window.DOMINOES_UNIT_STRING = "";
	
	dominoes.functor( "concat" , function( url ) {
		
		return "./data/concat.php?str=" + url;
		
	});
	
	dominoes( "$concat(MY_VALUE)" , function() {
		
		strictEqual( window.DOMINOES_UNIT_STRING , "MY_VALUE" , "Options were filtered" );
		dominoes.functor( false );
		start();
		
	});
	
});

test("Replace by function" , function() {
	
	expect( 1 );
	
	stop();
	
	var string;
	
	dominoes.functor( "test" , function( url ) {
		
		return function() {
			string = url;
		};
		
	});
	
	dominoes( "$test(TEST_VALUE)" , function() {
		
		strictEqual( string , "TEST_VALUE" , "Function was called" );
		dominoes.functor( false );
		start();
		
	});
	
});

test("Recursive" , function() {
	
	expect( 3 );
	
	stop();
	
	dominoes.functor( "outside" , function( url ) {
		
		strictEqual( url , "SAMPLE_FROM_INSIDE" , "Outside was called" );
		
		return noOp;
		
	});
	
	dominoes.functor( "inside" , function( url ) {
		
		ok( true , "Inside was called" );
		
		return url + "_FROM_INSIDE";
		
	});
	
	dominoes( "$outside($inside(SAMPLE))" , function() {
		
		ok( true , "Completed" );
		dominoes.functor( false );
		start();
		
	});
	
});

test("String gets passed as options" , function() {
	
	var test = "";
	
	dominoes.functor("test(O)", function( options ) {
		test += options.url;
		return noOp;
	});
	
	stop();
	
	dominoes("$test(URL)" , function() {
		strictEqual( test , "URL" , "String was changed to options" );
		dominoes.functor( false );
		start();
	});
	
});

test("String gets passed as function" , function() {
	
	expect( 2 );
	
	dominoes.functor("test(F)", function( functor ) {
		ok( true , "String was transformed into a function" )
		return functor;
	});
	
	window.DOMINOES_UNIT_STRING = "";
	
	stop();
	
	dominoes( "$test(" + url( "./data/concat.php?str=A" ) + ")" , function() {	
		strictEqual( window.DOMINOES_UNIT_STRING , "A" , "URL was fetched" );
		dominoes.functor( false );
		start();
	});
	
});

test("Selective given type" , function() {
	
	var test = "";
	
	dominoes.functor("test(S)", function( string ) {
		test += string;
		return {
			url: "URL"
		};
	});

	dominoes.functor("test(O)", function( options ) {
		test += " " + options.url;
		return noOp;
	});
	
	dominoes.functor("test(F)", function( functor ) {
		test += " " + ( functor === noOp );
		return functor;
	});
	
	stop();
	
	dominoes("$test($test($test(STRING)))" , function() {
		strictEqual( test , "STRING URL true" , "Filtering worked" );
		dominoes.functor( false );
		start();
	});
	
});

test("Accumulator (simple)" , function() {
	
	var result;
	
	dominoes.functor("test(+)" , function( array ) {
		
		result = "" + array;
		
	} );
	
	stop();
	
	dominoes("$test(A) $test(F) $test(E) $test(B) $test(D) $test(C)" , function() {
		strictEqual( result , "A,F,E,B,D,C" , "Accumulator worked" );
		dominoes.functor( false );
		start();
	} );
	
});

test("Accumulator (multiple)" , function() {
	
	expect(1);
	
	var result;
	
	dominoes.functor("test(+)" , function( array ) {
		
		result = "" + array;
		
	} );
	
	stop();
	
	var number = 5;
	
	for ( var letter in { D:1 , E:1 , A:1 , C:1 , B:1 , F:1 } ) {
		dominoes( "$test(" + letter + ")" , function() {
			if ( ! --number ) {
				strictEqual( result , "D,E,A,C,B,F" , "Accumulator worked" );
				dominoes.functor( false );
				start();
			}
		} );
	}
	
});

test("Accumulator (multiple, asynchronous)" , function() {
	
	expect(1);
	
	var result;
	
	dominoes.functor("test(+)" , function( array ) {
		
		return function( callback ) {
			
			setTimeout( function() {
				
				result = "" + array;
				callback();
				
			} , 50 );
			
			return false;
		};
		
	} );
	
	stop();
	
	var number = 6;
	
	for ( var letter in { D:1 , E:1 , A:1 , C:1 , B:1 , F:1 } ) {
		dominoes( "$test(" + letter + ")" , function() {
			if ( ! --number ) {
				strictEqual( result , "D,E,A,C,B,F" , "Accumulator worked" );
				dominoes.functor( false );
				start();
			}
		} );
	}
	
});

test("Accumulator (redefine)" , function() {
	
	var control;
	
	dominoes.functor("test(+)" , function( array ) {
		control = "" + array + 1;
	} );
	
	dominoes.functor("test(+)" , function( array ) {
		control = "" + array + 2;
	} );
	
	stop();
	
	dominoes("$test(A)" , function() {
		strictEqual( control , "A2" , "Functor was redefined" );
		dominoes.functor( false );
		start();
	} );
	
});

test("Accumulator (url)", function() {
	
	window.DOMINOES_UNIT_STRING = "";
	
	stop();
	
	dominoes.functor("jQuery(+)" , function( array ) {
		
		return url( "data/concat.php?str=" + escape( array.join(" ") ) );
		
	} );
	
	dominoes("$jQuery(core) $jQuery(ajax) $jQuery(event) $jQuery(css)" , function() {
		
		strictEqual( window.DOMINOES_UNIT_STRING ,  "core ajax event css" , "URL was properly built" );
		dominoes.functor( false );
		start();
		
	} );
	
});

test("Accumulator (complex scenario)", function() {
	
	window.DOMINOES_UNIT_STRING = "";
	
	stop();
	
	dominoes.functor("_jQuery(+)" , function( array ) {
		
		return url( "data/concat.php?str=" + escape( array.join(" ") ) );
		
	} );
	
	for ( var lib in { core:1 , ajax:1 , event:1 , css:1 , manipulation:1 } ) {
		dominoes.rule( "jQuery:" + lib , "$_jQuery(" + lib + ")" );
	}
	
	var number = 4;
	
	function done() {
		if ( ! --number ) {
			strictEqual( window.DOMINOES_UNIT_STRING , "core ajax event css manipulation ajaxCode eventCode cssCode manipulationCode" , "Proper order" );
			dominoes.rule( false );
			dominoes.functor( false );
			start();
		}
	}
	
	dominoes("jQuery:core jQuery:ajax" , function() {
		window.DOMINOES_UNIT_STRING += " ajaxCode";
		done();
	} );
	
	dominoes("jQuery:core jQuery:event jQuery:css" , function() {
		window.DOMINOES_UNIT_STRING += " cssCode";
		done();
	} );
	
	dominoes("jQuery:core jQuery:manipulation" , function() {
		window.DOMINOES_UNIT_STRING += " manipulationCode";
		done();
	} );
	
	dominoes("jQuery:core jQuery:ajax jQuery:event" , function() {
		window.DOMINOES_UNIT_STRING += " eventCode";
		done();
	} );
	
});