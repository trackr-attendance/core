var attendance = require('./attendance');
var del = require('del');
var video = require('./video');
var Q = require('q');
Q.longStackSupport = true;

var admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert(require("./trackr-attendance-d70b149c2ccc.json")),
    databaseURL: "https://trackr-attendance.firebaseio.com"
});

video.stills('testClass.mov').then(function (filenames) {
	return Q.all(filenames.map(function (filename) {
		return attendance.snapshot(filename, 'MIT-1.125-2017');
	})).then(function (data){
		return { attendance: data , files: filenames};
	});
}).then(function(filenames){
	console.log(JSON.stringify(filenames, null, 4));
	// Delete Full Filenames
	return del(filenames.files);
}).catch(function (error) {
    console.error(error);
}).progress(function (progress) {
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write(' Processing ' + progress.percent + ' '+ progress.time + ' / ' + progress.duration + ' ' + progress.srcfps + ' fps');
}).fin(function (){
	admin.app().delete();
});