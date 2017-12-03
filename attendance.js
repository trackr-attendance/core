var upload = require('./upload');
var faces = require('./faces');
var faceIsolation = require('./faceIsolation');
var identify = require('./identification');
var Q = require('q');

exports.snapshot = function(file, collection){
	return upload.uploadFile(file).then(function (photo){
		return faces.find(photo.Location).then(function (faces){
			return faceIsolation.generateIndividualFacePhotos(file, faces).then(function(photos){
				return Q.all(photos.map(function (face) {
					return identify.attendance(collection, face.path, face);
				})).then(function (data){
					return { attendance: data };
				});
			});
		}).then(function (data){
			data.frame = photo
			return data;
		});
	});
}