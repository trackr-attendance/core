var attendance = require('./attendance');

var admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert(require("./trackr-attendance-d70b149c2ccc.json")),
    databaseURL: "https://trackr-attendance.firebaseio.com"
});

attendance.snapshot('test001.jpg', 'MIT-1.125-2017').then(function (data){
	console.log('data)', data);
}).catch(function (error){
	console.log('error)', error);
}).fin(function () {
	admin.app().delete();
});