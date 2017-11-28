var fs = require('fs-extra');

// AWS Configuration
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./awsConfig.json');

// Firebase Configuration
var admin = require("firebase-admin");

exports.makePersonReference = function (externalImageId){
    fbRef = externalImageId.split('-');

    // Clean Up Course Number
    fbRef[1] = fbRef[1].replace('.','');

    // Add in Roster / Students Tree
    person = fbRef.splice(-3, 3, 'roster', 'students')

    // Add Person Index "Id's" are 1 off from Array Index in Firebase
    fbRef.push(person[0]-1);

    // Add Global Root
    fbRef.unshift('courses');

    return {
        ref: fbRef.join('/'),
        first: person[1],
        last: person[2]
    };
}

exports.getPerson = function(externalImageId){
    ref = exports.makePersonReference(externalImageId);

    var closeFirebase = false;
    if (admin.apps.length === 0) {
        // default to new instance if not set
        admin.initializeApp({
            credential: admin.credential.cert(require("./trackr-attendance-d70b149c2ccc.json")),
            databaseURL: "https://trackr-attendance.firebaseio.com"
        });
        closeFirebase = true;
    }

    db = admin.database();

    return db.ref(ref.ref).once('value').then(function(snapshot) {
        // Close One Off Firebase Connection
        if (closeFirebase) {
            admin.app().delete()
        }

        // Match First Name
        if (ref.first.toLowerCase() == snapshot.val().first.replace(/[^a-zA-Z0-9_.]/,'').toLowerCase()){
            // Match Last Name
            if (ref.last.toLowerCase() == snapshot.val().last.replace(/[^a-zA-Z0-9_.]/,'').toLowerCase()){
                return snapshot.val();
            }else{
                throw new Error("Couldn't find matching person");
            }
        }
    });
}

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
            return {name: data.FaceMatches[0].Face.ExternalImageId, confidence: data.FaceMatches[0].Face.Confidence};
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
        
        return {engagement: score, emotions: data.FaceDetails[0].Emotions};
    })
};