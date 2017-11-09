var upload = require('./upload');
var faces = require('./faces');
var faceIsolation = require('./faceIsolation');

var file = 'test001.jpg';

upload.uploadFile(file).then(function (photo){
	faces.find(photo.Location).then(function (faces){
		faceIsolation.generateIndividualFacePhotos(file, faces).then(function(value){
			console.log(value);
		});
	});
});