var Q = require('q');
var admin = require("firebase-admin");
var attendance = require('./attendance');
var del = require('del');
var merge = require('deepmerge');
var video = require('./video');

admin.initializeApp({
    credential: admin.credential.cert(require("./trackr-attendance-d70b149c2ccc.json")),
    databaseURL: "https://trackr-attendance.firebaseio.com"
});

video.stills('testClass.mov').then(function (recording) {
	return Q.all(recording.files.map(function (filename) {
		return attendance.snapshot(filename, 'MIT-1.125-2017');
	})).then(function (data){
		return merge.all([{attendance: data}, recording]);
	});
}).then(function(trackr){
	console.log(JSON.stringify(trackr, null, 4));
	// Delete Full Filenames
	return del(trackr.files);
}).catch(function (error) {
    console.error(error);
}).progress(function (progress) {
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write(' Processing ' + progress.percent + ' '+ progress.time + ' / ' + progress.duration + ' ' + progress.srcfps + ' fps');
}).fin(function (){
	admin.app().delete();
});