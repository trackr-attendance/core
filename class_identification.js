var fs = require('fs-extra');
var Q = require('q');
var merge = require('deepmerge')

// Firebase Configuration
var admin = require("firebase-admin");

// Function to get path to class name in Firebase
exports.makeClassReference = function (externalImageId){
    fbRef = externalImageId.split('-');

    // Clean Up Course Number
    fbRef[1] = fbRef[1].replace('.','');

    // Add in Roster / Students Tree
    var path = "courses/" + fbRef[0] + "/" + fbRef[1] + "/" + fbRef[2] + "/" + "name" ;
    return path;
}

// Function to retrieve class name from Firebase path found in makeClassReference()
exports.getClass = function(externalImageId){

    var closeFirebase = false;
    if (admin.apps.length === 0) {
        // default to new instance if not set
        var serviceAccount = require("./firebasekey2.json"); //NOTE: we'll have to update key location********
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: "https://trackr-attendance.firebaseio.com"
        });
        closeFirebase = true;
    }

    var db = admin.database();
    var ref = db.ref(exports.makeClassReference(externalImageId));

    return ref.on("value", function(snapshot) {
        // Close One Off Firebase Connection
        if (closeFirebase) {
            admin.app().delete()
        }

        //Retrieve class name from Firebase
          console.log(snapshot.val());
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
}

//run function
var externalImageId = "MIT-1.125-2017-13-Aramael-PenaAlcantara" //for testing only*******
exports.getClass(externalImageId)
