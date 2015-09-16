'use strict';

var P = require('bluebird'); //jshint ignore:line
var _ = require('lodash');
var should = require('should');
var lib = require('../lib');

describe('bluebird test', function(){
	it('reduce', function(done){
		this.timeout(30000);
		var count = 10000000;
		var array = _.range(count);
		var start = Date.now();
		P.reduce(array, function(total, value){
			return total + value;
		}, 0)
		.then(function(ret){
			var rate = count * 1000 / (Date.now() - start);
			console.log(rate);
			done();
		});
	});

	it('then', function(done){
		this.timeout(30000);
		var count = 1000000;
		var start = Date.now();
		var p = P.resolve();
		for(var i=0; i<count; i++){
			p = p.then(function(){
			});
		}
		p.then(function(ret){
			var rate = count * 1000 / (Date.now() - start);
			console.log(rate);
			done();
		});
	});

	// it('yield', function(done){
	// 	this.timeout(30000);
	// 	var count = 10000000;
	// 	var start = Date.now();
	// 	P.coroutine(function*(){
	// 		for(var i=0; i<count; i++){
	// 			yield P.resolve();
	// 		}
	// 	})()
	// 	.then(function(){
	// 		var rate = count * 1000 / (Date.now() - start);
	// 		console.log(rate);
	// 		done();
	// 	});
	// });

	it('bind', function(done){
		this.timeout(30000);
		var count = 1000000;
		var array = _.range(count);
		var start = Date.now();
		P.reduce(array, function(total, value){
			return P.bind(this)
			.then(function(){
			});
		}, 0)
		.then(function(ret){
			var rate = count * 1000 / (Date.now() - start);
			console.log(rate);
			done();
		});
	});

	it('callback', function(cb){
		var count = 100000;
		var start = Date.now();
		var inc = function(i, cb){
			cb(null, i+1);
		};
		var inccb = function(err, ret){
			if(err){
				cb(err);
			}
			else{
				if(ret >= count){
					var rate = count * 1000 / (Date.now() - start);
					console.log(rate);
					return cb();
				}
				setImmediate(function(){
					inc(ret, inccb);
				});
			}
		};
		inc(0, inccb);
	});
});
