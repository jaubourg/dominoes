module("Property");

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
	
	dominoes.property( false );
	
	strictEqual( dominoes.property("NAME1") , undefined , "Property 1 was removed" );	
	strictEqual( dominoes.property("NAME2") , undefined , "Property 2 was removed" );	
	
});

test("Expansion" , function() {

	expect( 1 );
	
	stop();
	
	window.DOMINOES_UNIT_STRING = "";
	
	dominoes.property( "string" , "TEST_PROP_IN_URL" );
	
	dominoes( url( "./data/concat.php?str=$(string)" ) , function() {
		
		equal( window.DOMINOES_UNIT_STRING , "TEST_PROP_IN_URL" , "Property was properly expanded" );
		dominoes.property( false );
		start();
		
	});
	
});

test("Expansion (recursive)" , function() {

	expect( 1 );
	
	stop();
	
	window.DOMINOES_UNIT_STRING = "";
	
	dominoes.property( "tail" , "_IN_URL" );
	dominoes.property( "string" , "TEST_PROP$(tail)" );
	
	dominoes( url( "./data/concat.php?str=$(string)" ) , function() {
		
		equal( window.DOMINOES_UNIT_STRING , "TEST_PROP_IN_URL" , "Properties were properly expanded" );
		dominoes.property( false );
		start();
		
	});
	
});

test("Grouped definitions" , function() {
	
	dominoes.property( "toDelete" , "value" );
	
	dominoes.property({
		"one": "first",
		"toDelete": false,
		"two": "second"
	});
	
	strictEqual( dominoes.property("toDelete") , undefined , "toDelete OK" );
	strictEqual( dominoes.property("one") , "first" , "one OK" );
	strictEqual( dominoes.property("two") , "second" , "two OK" );
	
});

test("ifNot" , function() {
	
	dominoes.property.ifNot( "ifNot" , "A" );
	dominoes.property.ifNot( "ifNot" , "B" );
	
	strictEqual( dominoes.property("ifNot") , "A" , "ifNot works" );
	
})

