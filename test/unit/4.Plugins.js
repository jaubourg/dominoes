module("Plugins");

test("Undefined", function() {
	
	strictEqual( dominoes.plugin("non-existing") , undefined , "Undefined was returned" );
	
});

test("Setting / retrieving", function() {
	
	strictEqual ( dominoes.plugin( "test" , noOp ) , dominoes , "Setting a plugin returns dominoes" );
	strictEqual ( dominoes.plugin( "test" ) , noOp , "The plugin was properly stored" );
	
});

test("Deleting" , function() {
	
	dominoes.plugin( "toDelete" , noOp );
	dominoes.plugin( "toDelete" , false );
	
	strictEqual( dominoes.plugin( "toDelete" ) , undefined , "Plugin has been deleted" );
	
});

test("Empty list" , function() {
	
	dominoes.plugin( "NAME1" , noOp );
	dominoes.plugin( "NAME2" , noOp );
	
	dominoes.plugin();
	
	strictEqual( dominoes.plugin( "NAME1" ) , undefined , "Plugin 1 has been deleted" );
	strictEqual( dominoes.plugin( "NAME2" ) , undefined , "Plugin 2 has been deleted" );
	
});

test("Called" , function() {
	
	expect( 1 );
	
	var called;
	
	dominoes.plugin( "test" , function() {
		
		called = true;
		
		return noOp;
		
	});
	
	dominoes( "$test{TEST}" , function() {
		
		strictEqual( called , true , "Plugin was called" );
		dominoes.plugin();
		
	});
	
});

test("Options passed" , function() {
	
	expect( 1 );
	
	var url;
	
	dominoes.plugin( "test" , function( options ) {
		
		url = options.url;
		
		return noOp;
		
	});
	
	dominoes( "$test{TEST}" , function() {
		
		strictEqual( url , "TEST" , "Option object was passed" );
		dominoes.plugin();
		
	});
	
});

test("Filter options" , function() {
	
	expect( 1 );
	
	stop();
	
	window.DOMINOES_UNIT_STRING = "";
	
	dominoes.plugin( "concat" , function( options ) {
		
		options.url = "./data/concat.php?str=" + options.url;
		
		return options;
		
	});
	
	dominoes( "$concat{MY_VALUE}" , function() {
		
		strictEqual( window.DOMINOES_UNIT_STRING , "MY_VALUE" , "Options were filtered" );
		dominoes.plugin();
		start();
		
	});
	
});

test("Replace by function" , function() {
	
	expect( 1 );
	
	var string;
	
	dominoes.plugin( "test" , function( options ) {
		
		return function() {
			string = options.url;
		};
		
	});
	
	dominoes( "$test{TEST_VALUE}" , function() {
		
		strictEqual( string , "TEST_VALUE" , "Function was called" );
		dominoes.plugin();
		
	});
	
});

test("Ignore non-existing" , function() {
	
	expect( 1 );
	
	dominoes( "$non_existing{THIS_URL_WOULD_FAIL}" , function() {
		
		ok( true , "The action completed" );
		
	});
	
});

test("Recursive" , function() {
	
	expect( 3 );
	
	dominoes.plugin( "outside" , function( options ) {
		
		strictEqual( options.url , "SAMPLE_FROM_INSIDE" , "Outside was called" );
		
		return noOp;
		
	});
	
	dominoes.plugin( "inside" , function( options ) {
		
		ok( true , "Inside was called" );
		
		options.url += "_FROM_INSIDE";
		
		return options;
		
	});
	
	dominoes( "$outside{$inside{SAMPLE}}" , function() {
		
		ok( true , "Completed" );
		dominoes.plugin();
		
	});
	
});