var fs = require('fs-extra');

// AWS Configuration
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./awsConfig.json');

exports.match = function (collectionName, file) {
	var rekognition = new AWS.Rekognition();
    return rekognition.searchFacesByImage({
        "CollectionId": collectionName,
        "FaceMatchThreshold": 70,
        "Image": { 
            "Bytes": fs.readFileSync(file),
        },
        "MaxFaces": 1
    }).promise().then(function(data) {
        if(data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face)
        {
            return {name: data.FaceMatches[0].Face.ExternalImageId};
        } else {
            throw new Error("Individual not recognized");
        }
    });
}

exports.engagement = function (file){ //calculate emotion score
    var rekognition = new AWS.Rekognition();
    return rekognition.detectFaces({
        "Attributes": ["ALL"],
        "Image": { 
            "Bytes": fs.readFileSync(file),
        },
    }).promise().then(function(data) {
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
        
        return {engagement: score};
    })
};