// Firebase Configuration
var admin = require("firebase-admin");

// Function to get path to class name in Firebase
exports.makeCourseReference = function (externalImageId){
    fbRef = externalImageId.split('-');

    // Clean Up Course Number
    fbRef[1] = fbRef[1].replace('.','');

    // Add Global Root
    fbRef.unshift('courses');

    return fbRef.join('/');
}

// Function to retrieve class name from Firebase path found in makeClassReference()
exports.information = function(externalImageId){
    var ref = exports.makeCourseReference(externalImageId);

    var closeFirebase = false;
    if (admin.apps.length === 0) {
        // default to new instance if not set
        var serviceAccount = require("./firebasekey2.json");
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: "https://trackr-attendance.firebaseio.com"
        });
        closeFirebase = true;
    }

    var db = admin.database();
    return db.ref(ref).once('value').then(function(snapshot) {
        // Close One Off Firebase Connection
        if (closeFirebase) {
            admin.app().delete();
        }

		return snapshot.val();
    });
}