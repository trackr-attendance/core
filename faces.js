const cognitive = require('cognitive-services');

exports.find = function(photo){
	const face = new cognitive.face(require('./azureConfig.json'));

	const parameters = {
		returnFaceId: "true",
		returnFaceLandmarks: "false"
	};
	
	const headers = {
		'Content-type': 'application/json'
	};

	const body = {
		'url': photo
	};

	return face.detect({parameters, headers, body});
}