var upload = require('./upload');
var faces = require('./faces');

upload.uploadFile('test001.jpg').then(function (photo){
	faces.find(photo.Location).then(function (faces){
		console.log(faces);
	});
});