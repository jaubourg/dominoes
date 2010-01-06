module("Functor");

test("Undefined", function() {
	
	strictEqual( dominoes.functor("non-existing") , undefined , "Undefined was returned" );
	
});

test("Setting / retrieving", function() {
	
	strictEqual ( dominoes.functor( "test" , noOp ) , dominoes , "Setting a functor returns dominoes" );
	strictEqual ( dominoes.functor( "test" ) , noOp , "The functor was properly stored" );
	
});

test("Deleting" , function() {
	
	dominoes.functor( "toDelete" , noOp );
	dominoes.functor( "toDelete" , false );
	
	strictEqual( dominoes.functor( "toDelete" ) , undefined , "Functor has been deleted" );
	
});

test("Empty list" , function() {
	
	dominoes.functor( "NAME1" , noOp );
	dominoes.functor( "NAME2" , noOp );
	
	dominoes.functor( false );
	
	strictEqual( dominoes.functor( "NAME1" ) , undefined , "Functor 1 has been deleted" );
	strictEqual( dominoes.functor( "NAME2" ) , undefined , "Functor 2 has been deleted" );
	
});

test("Called" , function() {
	
	expect( 1 );
	
	stop();
	
	var called;
	
	dominoes.functor( "test" , function() {
		
		called = true;
		
		return noOp;
		
	});
	
	dominoes( "$test{TEST}" , function() {
		
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
	
	dominoes( "$test{TEST}" , function() {
		
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
	
	dominoes( "$concat{MY_VALUE}" , function() {
		
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
	
	dominoes( "$test{TEST_VALUE}" , function() {
		
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
	
	dominoes( "$outside{$inside{SAMPLE}}" , function() {
		
		ok( true , "Completed" );
		dominoes.functor( false );
		start();
		
	});
	
});
