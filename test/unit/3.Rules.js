module("Rules");

test("Undefined", function() {
	
	strictEqual( dominoes.rule("non-existing") , undefined , "Undefined was returned" );
	
});

test("Setting / retrieving", function() {
	
	strictEqual ( dominoes.rule( "test" , "SOME_URL" ) , dominoes , "Setting a rule returns dominoes" );
	strictEqual ( {}.toString.call ( dominoes.rule( "test" ) ) , "[object Function]" , "Rules are stored as functions" );
	
});

test("Empty list" , function() {
	
	dominoes.rule( "NAME" , "" );
	
	dominoes.rule();
	
	strictEqual( dominoes.rule("NAME") , undefined , "Rules were removed" );	
	
});

test("Expansion" , function() {
	
	expect( 2 );
	
	stop();
	
	var string = "";
	
	dominoes.rule( "myFunction" , function() {
		
		string += "myFunction was called";
		
	});
	
	dominoes( "myFunction" , function() {
		
		strictEqual( string , "myFunction was called" , "Rules was properly expanded" );
		
	} , "myFunction" , function() {
		
		strictEqual( string, "myFunction was called" , "Rules are only executed once" );
		dominoes.rule();
		start();
		
	});
	
});

test("On-the-fly definition" , function() {
	
	expect( 1 );
	
	stop();
	
	var string = "";
	
	dominoes( function() {
		
		dominoes.rule("myFunction" , function() {
			
			string += "myFunction was called";
			
		});
		
	} , "myFunction" , function() {

		strictEqual( string, "myFunction was called" , "Rules can be created on-the-fly" );
		dominoes.rule();
		start();
	});
	
});

test("Multiple definition" , function() {
	
	expect( 1 );
	
	stop();
	
	var string = "";
	
	dominoes.rule( "myFunction" , function() {
		
		string += "rule 1, ";
		
	});
	
	dominoes.rule( "myFunction" , function() {
		
		string += "rule 2";
		
	});
	
	dominoes( "myFunction" , function() {

		strictEqual( string, "rule 1, rule 2" , "Rules accept multiple definitions" );
		dominoes.rule();
		start();
	});
	
});

test("On-the-fly multiple definition" , function() {
	
	expect( 1 );
	
	stop();
	
	var string = "";
	
	dominoes.rule( "myFunction" , function() {
		
		string += "rule 1, ";
		
		dominoes.rule( "myFunction" , function() {
			
			string += "rule 2";
			
		});
	
	});
	
	dominoes( "myFunction" , function() {

		strictEqual( string, "rule 1, rule 2" , "Rules accept multiple definitions" );
		dominoes.rule();
		start();
	});
	
});
