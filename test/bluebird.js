'use strict';

var Promise = require('bluebird'); //jshint ignore:line
var _ = require('lodash');
var should = require('should');
var lib = require('../lib');

describe('bluebird test', function(){
	it.only('perf', function(done){
		var count = 1000000;
		var array = _.range(count);
		var start = Date.now();
		Promise.reduce(array, function(total, value){
			return total + value;
		}, 0)
		.then(function(ret){
			var rate = count * 1000 / (Date.now() - start);
			console.log(rate);
			done();
		});
	});

	it('test', function(done){
		new Promise(function(resolve, reject){
			throw new Error('err!');
		})
		.catch(console.log)
		.nodeify(done);
	});
});
