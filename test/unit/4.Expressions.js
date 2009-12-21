module("Expressions");

test("Serial execution" , function() {
	
	stop();
	
	var string = "";
		
	dominoes( {
		
		chain: "first > second",
		
		first: function(callback) {
			setTimeout( function() {
				string += "first ";
				callback();
			}, 100);
			return true;
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
	
	stop();
	
	var string = "";
	
	dominoes( {
		
		chain: "first second",
		
		first: function(callback) {
			setTimeout( function() {
				string += " first";
				callback();
			}, 100);
			return true;
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
		
		chain: "{{ first > restart }} second > third",
		
		first: function(callback) {
			setTimeout( function() {
				string += " first";
				callback();
			}, 100);
			return true;
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
