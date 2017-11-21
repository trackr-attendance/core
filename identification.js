var Q = require('q');
var config = require('./config.js');
var AWS = require('aws-sdk');
AWS.config.region = config.region;
var fs = require('fs-extra');
var rekognition = new AWS.Rekognition({region: config.region});

const dir = './parsed'; //location of parsed faces *** update for S3 location ***
var filenames = fs.readdirSync(dir); //read file names

var name = null
var bitmap = fs.readFileSync("./parsed/" + filenames[1] );


function match(face) { //match face to name
    var deferred = Q.defer();
    rekognition.searchFacesByImage({
        "CollectionId": config.collectionName,
        "FaceMatchThreshold": 70,
        "Image": { 
            "Bytes": face,
        },
        "MaxFaces": 1
    }, function(err, data) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            if(data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face)
            {
                deferred.resolve({
                    key:   "Name",
                    value: data.FaceMatches[0].Face.ExternalImageId
                });
            } else {
                deferred.reject(new Error("Not recognized"));
            }
        }
    });    
    return deferred.promise;
}

function emotion(face){ //calculate emotion score
    var deferred = Q.defer();
    rekognition.detectFaces({
        "Attributes": ["ALL"],
        "Image": { 
            "Bytes": face,
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
                
                deferred.resolve({
                    key:   "Engagement",
                    value: score
                });

                //var returnValue = match(bitmap)
                //match face, adds to dictionary, and returns updated dictionary

            } 
        }
    )
    return deferred.promise;
};

match(bitmap).then(function (data){
    console.log(data);
});

emotion(bitmap).then(function (data){
    console.log(data);
});