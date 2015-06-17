'use strict';

var P = require('bluebird');
var mongodb = P.promisifyAll(require('mongodb'));

describe('mongodb', function(){
	before(function(cb){
		var self = this;
		mongodb.MongoClient.connect('mongodb://localhost/test', function(err, ret){
			if(err){
				return cb(err);
			}
			self.conn = ret;
			cb();
		});
	});

	after(function(cb){
		this.conn.close(cb);
	});

	it.only('update', function(done){
		this.timeout(100000);
		var coll = this.conn.collection('test');
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
			coll.update({_id : 1}, {index : index}, {upsert : true}, next);
		};
		next();
	});

	it('async cursor', function(done){
		this.timeout(100000);

		/**
		* smartForEach
		*
		* itor - array, iterator or asyncIterator(with .next(cb))
		* func - return promise or use cb
		* returns - promise or use cb
		*/
		var smartForEach = function(itor, func, cb){
			if(Array.isArray(itor)){ // Translate to iterator if itor is normal array
				var i = 0;
				return smartForEach({
					next : function(){
						if(i >= itor.length){
							return null;
						}
						else{
							return itor[i++];
						}
					}
				}, func);
			}

			var deferred = P.defer();

			var handleItem = function(value){
				if(value === null){
					return deferred.resolve();
				}
				// Callback style if func accept 2nd argument
				if(func.length === 2){
					return func(value, next);
				}
				// promise style
				P.try(function(){
					return func(value);
				})
				.nodeify(next);
			};

			var next = function(err){
				if(err){
					return deferred.reject(err);
				}
				// normal iterator with .next()
				if(itor.next.length === 0){
					return handleItem(itor.next());
				}
				// async iterator with .next(cb)
				itor.next(function(err, value){
					if(err){
						return deferred.reject(err);
					}
					handleItem(value);
				});
			};
			next();

			if(typeof(cb) === 'function'){
				return deferred.promise.nodeify(cb);
			}
			else{
				return deferred.promise;
			}
		};

		var coll = this.conn.collection('test');
		smartForEach(coll.find().limit(1000), function(item){
			return P.delay(10).then(function(){
				console.log(item);
			});
		}).nodeify(done);
	});
});


