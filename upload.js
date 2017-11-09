var fs = require('fs');
var AWS = require('aws-sdk');
var path = require('path');
const uuidv4 = require('uuid/v4');
var Q = require('q');

exports.uploadFile = function(file){
	return Q.fcall(function () {

		// Load credentials and set region from JSON file
		AWS.config.loadFromPath('./awsConfig.json');

		// Create S3 service object
		s3 = new AWS.S3({apiVersion: '2006-03-01'});

		// call S3 to retrieve upload file to specified bucket
		var uploadParams = {Bucket: 'trackr-attendance', Key: '', Body: '', ACL: 'public-read'};

		var fileStream = fs.createReadStream(file);
		fileStream.on('error', function(err) {
			throw new Error(err);
		});
		uploadParams.Body = fileStream;

		uploadParams.Key = uuidv4() + path.extname(file);

		var s3Data = {};
		// call S3 to retrieve upload file to specified bucket
		return s3.upload (uploadParams).promise();
	});
}
