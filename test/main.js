require('dotenv').load();

var assert = require("assert"),
	async = require('async')
	describe('fs-cloud', function() {
		var MongoClient, url, db, collection, fs;
		before(function(done) {
			var FileSystemCloud = require('../');
			fs = new FileSystemCloud({});
			done();
		})
		it('conectar a disco', function(done) {
			fs.connect(process.env.MONGO || 'mongodb://127.0.0.1:27017/mydrive', function(err) {
				assert.equal(null, err);
				done();
			})
		})
		it('escribir "demo.txt"', function(done) {
			fs.writeFile('demo.txt', 'This is an example', function(err) {
				assert.equal(null, err);
				done();
			});
		})
		it('escribir "demo.txt", debe dar error', function(done) {
			fs.writeFile('demo.txt', 'This is an example', function(err) {
				assert.equal(null, err);
				done();
			});
		})
		var list;
		it('obtener lista de archivos', function(done) {
			fs.ls({}, function(err, list_) {
				assert.equal(null, err);
				list = list_;
				done()
			});
		})
		it('leer cada archivo por ID', function(done) {
			async.map(list, function(file, done) {
				fs.read(file._id, function(err, data) {
					assert.equal(null, err);
					assert.equal('This is an example', data);
					done();
				});
			}, done);
		})
		it('borrar archivos por ID', function(done) {
			async.map(list, function(file, done) {
				fs.rm(file._id, function(err) {
					assert.equal(null, err);
					done();
				});
			}, done);
		})
		it('escribir archivo como "me.txt"', function(done) {
			fs.writeFile('me.txt', 'This is an example two', function(err) {
				assert.equal(null, err);
				done();
			});
		})
		it('buscar por nombre', function(done) {
			fs.read('me.txt', function(err, data) {
				assert.equal(null, err);
				assert.equal('This is an example two', data);
				done()
			})
		})
		it('borrar por nombre', function(done) {
			fs.rm('me.txt', function(err, data) {
				assert.equal(null, err);
				done()
			})
		})
	})