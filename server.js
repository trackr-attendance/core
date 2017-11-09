var upload = require('./upload');

upload.uploadFile('test001.jpg').then(function (data){
	console.log("resolved", data);
});