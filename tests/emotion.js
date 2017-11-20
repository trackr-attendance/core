var express = require('express');
var app = express();

var config = require('./config.js')

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });

var AWS = require('aws-sdk');
AWS.config.region = config.region;

var uuid = require('node-uuid');
var fs = require('fs-extra');
var path = require('path');

var admin = require("firebase-admin");
var serviceAccount = require("./firebasekey.json"); ////*** update this with Aramel's key ***
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://trackr-ac2f0.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("emotions");


app.use(express.static('public'));

var rekognition = new AWS.Rekognition({region: config.region});

const dir = './parsed'; //location of parsed faces *** update for S3 location ***
var filenames = fs.readdirSync(dir);

//lopping through all faces and displaying emotion, eyes open, and pose
for (var i = 1; i < filenames.length; i++) { //note: starting at i=1 to avoid dot file
	var bitmap = fs.readFileSync("./parsed/" + filenames[i] );

	rekognition.detectFaces({
	 	"Attributes": ["ALL"],
	 	"Image": { 
	 		"Bytes": bitmap,
	 	},
	}, function(err, data) {
	 	if (err) {
	 		console.log(err);
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

				console.log("Engagement Score " + i + ": " + score); //why won't isn't i from for loop getting called here?????

				//for sending data to firebase*****
				// var postsRef = ref.child("posts");
				// var newPostRef = postsRef.push();
				// newPostRef.set({
				//   FaceID: filenames[i]
				//   Engagement: score
				// });

			} 
		}
	);
}



