module("Properties");

test("Undefined", function() {
	
	strictEqual( dominoes.property("non-existing") , undefined , "Undefined was returned" );
	
});

test("Setting / retrieving", function() {
	
	strictEqual ( dominoes.property( "test" , "test value" ) , dominoes , "Setting a property returns dominoes" );
	strictEqual ( dominoes.property( "test" ) , "test value" , "Property was properly set" );
	
});

test("Deleting" , function() {
	
	dominoes.property( "toDelete" , "will be deleted" );
	dominoes.property( "toDelete" , false );
	
	strictEqual( dominoes.property( "toDelete" ) , undefined , "Property has been deleted" );
	
});

test("Empty list" , function() {
	
	dominoes.property( "NAME1" , "VALUE1" );
	dominoes.property( "NAME2" , "VALUE2" );
	
	dominoes.property();
	
	strictEqual( dominoes.property("NAME1") , undefined , "Property 1 was removed" );	
	strictEqual( dominoes.property("NAME2") , undefined , "Property 2 was removed" );	
	
});

test("Eval" , function() {
	
	dominoes.property( "firstName" , "Julian" ).property( "lastName" , "Aubourg" );
	
	equal( dominoes.eval("${firstName} ${lastName}") , "Julian Aubourg" , "firstName lastName was properly evaled" );
	
});

test("Eval (recursive)" , function() {
	
	dominoes.property( "firstName" , "Julian" )
		.property( "lastName" , "Aubourg" )
		.property( "name" , "${firstName} ${lastName}" );
	
	
	equal( dominoes.eval("${name}") , "Julian Aubourg" , "name was properly expanded as firstName lastName" );
	
});

test("Expansion" , function() {

	expect( 1 );
	
	stop();
	
	window.DOMINOES_UNIT_STRING = "";
	
	dominoes.property( "string" , "TEST_PROP_IN_URL" );
	
	dominoes( url( "./data/concat.php?str=${string}" ) , function() {
		equal( window.DOMINOES_UNIT_STRING , "TEST_PROP_IN_URL" , "Property was properly expanded" );
		start();
	});
	
});
