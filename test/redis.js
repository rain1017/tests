'use strict';

var P = require('bluebird');
var redis = P.promisifyAll(require('redis'));

describe('redis test', function(){
	it('connect', function(cb){
		this.timeout(300000);

		var client = null;

		return P.try(function(){
			client =  redis.createClient(6379, '127.0.0.1');
			client.on('error', function(){});

			//return client.subscribeAsync('channel');
			return client.selectAsync(1);
		})
		.delay(1000)
		.then(function(){
			console.log('set');
			return client.setAsync('key', 'value').then(console.log);
		})
		.delay(1000)
		.then(function(){
			console.log('publish');
			return client.publishAsync('channel', 'value').then(console.log);
		})
		.delay(1000)
		.then(function(){
			console.log('quit');
			return client.quitAsync();
		})
		.nodeify(cb);
	});
});
