var mongo = require('mongodb'),
	merge = require('merge'),
	mime = require('mime'),
	async = require('async');
var MongoClient = mongo.MongoClient,
	Grid = mongo.Grid;

function fsCloud(options) {
	this.options = merge(options, {
		collection: 'disk'
	});
	this.mongo = 'ok';
	this.disk = null;
	this.collection = null;
}
fsCloud.prototype.connect = function(url, bk) {
	var self = this;
	MongoClient.connect(url, function(err, db) {
		if (err) return bk(err);
		self.db = db;
		self.disk = new Grid(db, self.options.collection);
		self.collection = db.collection(self.options.collection + '.files');
		//self.collection.ensureIndex({filename:1}, {unique:true, dropDups:true}, function(err, indexName){
			bk(err);
		//});
		
	});
}
fsCloud.prototype.writeFile = function(filename, data, bk) {
	var buffer = new Buffer(data);
	var information = {
		filename: filename,
		content_type: mime.lookup('file.txt'),
		metadata: {
			filename: filename
		}
	};
	this.disk.put(buffer, information, function(err, fileInfo) {
		bk(err)
	});
	//mime.lookup('file.txt')
}
fsCloud.prototype.ls = function(search, bk) {
	this.collection.find(search, {
		filename: true,
		_id: true
	}).toArray(function(err, result) {
		bk(err, result)
	});
}
fsCloud.prototype.rm = function(id, bk) {
	var works = [],
		self = this;
	if (typeof id == 'string') works.push(function(done) {
		self.collection.findOne({
			filename: id
		}, {
			_id: true
		}, function(err, id_) {
			id = id_._id;
			done(id._id);
		})
	});
	async.parallel(works, function() {
		self.disk.delete(id, function(err) {
			bk(err)
		});
	})
}
fsCloud.prototype.read = function(id, bk) {
	var works = [],
		self = this;
	if (typeof id == 'string') works.push(function(done) {
		self.collection.findOne({
			filename: id
		}, {
			_id: true
		}, function(err, id_) {
			id = id_._id;
			done(id._id);
		})
	});
	async.parallel(works, function() {
		self.disk.get(id, function(err, buffer) {
			bk(err, buffer.toString())
		});
	})
}
module.exports = fsCloud;