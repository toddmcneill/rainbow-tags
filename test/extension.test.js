/* global suite, test */

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const vscode = require('vscode');
// const myExtension = require('../extension');

// Defines a Mocha test suite to group tests of similar kind together
suite("Rainbow Tag Tests", function() {

	// Defines a Mocha unit test
	test("Test basic regex", function() {
		assert.equal("Ha, no tests yet, sorry. Please contribute.", "Ha, no tests yet, sorry. Please contribute.");
	});
});
