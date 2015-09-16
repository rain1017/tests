'use strict';

var util = require('util');
var mysql = require('mysql');

describe('mysql', function(){
	before(function(cb){
		var self = this;
		this.conn = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			//password : 'secret'
		});
		this.conn.query('use test', cb);
	});

	after(function(cb){
		this.conn.end();
		cb();
	});

	it('update', function(done){
		this.timeout(100000);

		var conn = this.conn;
		var count = 100000;

		var startTick = Date.now();
		var index = 0;
		var next = function(err, ret){
			if(err){
				return done(err);
			}
			if(index >= count){
				var rate = count * 1000 / (Date.now() - startTick);
				console.log(rate);
				return done();
			}
			index++;

			conn.query(util.format('update test set type=%s where id=1', index), next);
		};

		conn.query('start transaction', next);
	});
});


