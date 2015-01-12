'use strict';

var should = require('should');
var lib = require('../lib');

describe('test suite', function(){
	it('should pass', function(done){
		lib.add(1, 1).should.equal(2);
		done();
	});
});
