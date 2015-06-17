'use strict';

var should = require('should');
var lib = require('../lib');
var _ = require('lodash');

describe('test suite', function(){
	it('should pass', function(done){
		lib.add(1, 1).should.equal(2);
		done();
	});

    it('clone', function(cb){
        this.timeout(30000);

        var data = [];
        _.range(1).forEach(function(index){
            var dct = {};
            _.range(10000).forEach(function(key){
                dct[key] = key;
            });
            data.push(dct);
        });
        console.log(JSON.stringify(data).length);

        var count = 500;
        var copy = null;
        var start = Date.now();
        for(var i=0; i<count; i++){
            //copy = utils.cloneEx(data);
            copy = JSON.parse(JSON.stringify(data));
            //copy = clone(data);
        }
        console.log(1000 * count / (Date.now() - start));
        cb();
    });

    it('json/bson test', function(cb){
        var bson = require('bson');
        var BSON = bson.native().BSON;
        // All bson types
        var bsonTypes = [bson.Long, bson.ObjectID, bson.Binary, bson.Code, bson.DBRef, bson.Symbol, bson.Double, bson.Timestamp, bson.MaxKey, bson.MinKey];
        // BSON parser
        var bsonParser = new BSON(bsonTypes);

        var obj = {str : 'value', number : 1.2, array : [1, 2, 'hello'], dt : new Date()};

        var count = 100000;
        var start = Date.now();
        var encoded = null;
        for(var i=0; i<count; i++){
            encoded = JSON.stringify(obj);
        }
        console.log('json encode: ' , 1000 * count / (Date.now() - start));

        start = Date.now();
        for(i=0; i<count; i++){
            JSON.parse(encoded);
        }
        console.log('json decode: ' , 1000 * count / (Date.now() - start));

        start = Date.now();
        for(i=0; i<count; i++){
            encoded = bsonParser.serialize(obj);
        }
        console.log('bson encode: ' , 1000 * count / (Date.now() - start));

        start = Date.now();
        for(i=0; i<count; i++){
            bsonParser.deserialize(encoded);
        }
        console.log('bson decode: ' , 1000 * count / (Date.now() - start));

        cb();
    });

	it('setInterval test', function(){
		var count = 1000000;

		var startTick = new Date().getTime();
		var dct = {};
		for(var i=0; i<count; i++){
			dct[i + 'key'] = i;
		}

		console.log(new Date().getTime() - startTick);
	});
});


