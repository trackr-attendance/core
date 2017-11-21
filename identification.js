var Q = require('q');
var fs = require('fs-extra');
var AWS = require('aws-sdk');

var config = require('./config.js');
AWS.config.region = config.region;
var rekognition = new AWS.Rekognition({region: config.region});

exports.match = function (file) { //match face to name
    var deferred = Q.defer();
    rekognition.searchFacesByImage({
        "CollectionId": config.collectionName,
        "FaceMatchThreshold": 70,
        "Image": { 
            "Bytes": fs.readFileSync(file),
        },
        "MaxFaces": 1
    }, function(err, data) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            if(data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face)
            {
                deferred.resolve({name: data.FaceMatches[0].Face.ExternalImageId});
            } else {
                deferred.reject(new Error("Not recognized"));
            }
        }
    });
    return deferred.promise;
}

exports.engagement = function (face){ //calculate emotion score
    var deferred = Q.defer();

    rekognition.detectFaces({
        "Attributes": ["ALL"],
        "Image": { 
            "Bytes": fs.readFileSync(file),
        },
    }, function(err, data) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
                var score = 0;
                for (var j = 0; j < 3; j++) {
                    //bonus for being confused... implies you're paying attention?
                    if(data.FaceDetails[0].Emotions[j].Type == "CONFUSED"){
                        score += 1/3 * data.FaceDetails[0].Emotions[j].Confidence / 100
                    }
                    //bonus for being happy
                    if(data.FaceDetails[0].Emotions[j].Type == "HAPPY"){
                        score += 1/3 * data.FaceDetails[0].Emotions[j].Confidence / 100
                    }
                };
                //bonus for eyes open
                if(data.FaceDetails[0].EyesOpen.Value == true){
                    score += 1/3 * data.FaceDetails[0].EyesOpen.Confidence / 100
                };
                //bonus for head up
                score += data.FaceDetails[0].Pose.Pitch / 100;
                
                deferred.resolve({engagement: score});
            } 
        }
    )
    return deferred.promise;
};

match(bitmap).then(function (data){
    console.log(data);
});

engagement(bitmap).then(function (data){
    console.log(data);
});