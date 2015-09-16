'use strict';

var _ = require('lodash');
var P = require('bluebird');


describe('mongoose', function(){
    it('perf', function(cb){
       	this.timeout(300 * 1000);
		var mongoose = require('mongoose');
		mongoose = P.promisifyAll(mongoose);

        var queryCount = 200, concurrency = 100;

        delete mongoose.connection.models.player;

        var Player = mongoose.model('player', new mongoose.Schema({
            _id : String,
            exp : Number,
        }, {collection : 'player'}));

        return P.try(function(){
            return mongoose.connectAsync('mongodb://localhost/memdb-test');
        })
        .then(function(){
            var startTick = Date.now();

            return P.map(_.range(concurrency), function(playerId){
                var player = new Player({_id : playerId, exp : 0});

                return P.each(_.range(queryCount), function(){
                    player.exp++;
                    return player.saveAsync();
                });
            })
            .then(function(){
                var rate = queryCount * concurrency * 1000 / (Date.now() - startTick);
                console.log('Rate: %s', rate);
            });
        })
        .then(function(){
            return mongoose.disconnectAsync();
        })
        .nodeify(cb);
    });
});
