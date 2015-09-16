'use strict';

// Fast javascript set
// Use array at begining, and switch to hashmap when elements is too many
// This can prevent v8 from creating too many hidden class
// (http://www.html5rocks.com/en/tutorials/speed/v8/)
// (http://stackoverflow.com/questions/16124556/will-v8-generate-hidden-classes-for-an-object-used-as-an-associative-array-lar)

var MAX_ARRAY_SIZE = 100000;
var MIN_HASHMAP_SIZE = 50000;

var FastSet = function(){
	this.keys = [];
	this.size = 0;
};

FastSet.prototype.add = function(key){
	if(this.contains(key)){
		return;
	}
	if(Array.isArray(this.keys)){
		this.keys.push(key);
		if(this.size > MAX_ARRAY_SIZE){
			// turn into hashmap
			var keys = {};
			this.keys.forEach(function(key){
				keys[key] = true;
			});
			this.keys = keys;
		}
	}
	else{
		this.keys[key] = true;
	}
	this.size++;
};

FastSet.prototype.remove = function(key){
	if(Array.isArray(this.keys)){
		var index = this.keys.indexOf(key);
		if(index !== -1){
			this.keys.splice(index, 1);
			this.size--;
		}
	}
	else{
		if(this.keys.hasOwnProperty(key)){
			delete this.keys[key];
			this.size--;
			if(this.size < MIN_HASHMAP_SIZE){
				// turn into array
				this.keys = Object.keys(this.keys);
			}
		}
	}
};

FastSet.prototype.contains = function(key){
	if(Array.isArray(this.keys)){
		return this.keys.indexOf(key) !== -1;
	}
	else{
		return this.keys.hasOwnProperty(key);
	}
};

FastSet.prototype.size = function(){
	return this.size;
};

FastSet.prototype.clear = function(){
	this.keys = [];
	this.size = 0;
};

FastSet.prototype.keys = function(){
	if(Array.isArray(this.keys)){
		return this.keys;
	}
	else{
		return Object.keys(this.keys);
	}
};

module.exports = FastSet;
