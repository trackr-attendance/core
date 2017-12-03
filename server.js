var Q = require('q');
var admin = require("firebase-admin");
var attendance = require('./attendance');
var argv = require('minimist')(process.argv.slice(2));
var course = require("./course");
var del = require('del');
var fs = require('fs-extra');
var merge = require('deepmerge');
var path = require('path');
var video = require('./video');

var error_res = [];
/* Course Tag */
if (!("class" in argv) || (typeof argv.class == 'undefined')){
	error_res.push("<class> needs to be present");
}

/* Video File */
if (!("video" in argv) || (typeof argv.video == 'undefined')){
	error_res.push("<video> needs to be present");
}else{
	if (!fs.pathExistsSync(argv.video)){
		error_res.push("<video> video file not found");
	}
}

if (error_res.length !== 0){
	console.log(error_res);
	process.exit(1);
}

// Open Firebase Connection
admin.initializeApp({
    credential: admin.credential.cert(require("./trackrAttendanceFirebaseConfig.json")),
    databaseURL: "https://trackr-attendance.firebaseio.com"
});

// Process Video
video.stills(path.resolve(argv.video)).then(function (recording) {
	return Q.all(recording.files.map(function (filename) {
		return attendance.snapshot(filename, 'MIT-1.125-2017');
	})).then(function (data){
		return merge.all([{attendance: data}, recording]);
	});
}).then (function (data){
	return course.information(argv.class).then(function(courseInfo){
		return merge.all([data, courseInfo]);
	});
}).then(function(trackr){
	// Write to Attendnace to Database
	return course.uploadAttendance(argv.class, trackr).then(function (trackr){
		// Write to Enagement to Database
		return course.uploadEngagement(argv.class, trackr).then(function (trackr){
			// Write to File
			return fs.writeJson('./output.json', trackr, {spaces: 2}).then(function (){
				return trackr;
			});
		});
	});
}).then(function (trackr){
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write('Completed. Check out trackrattendance.com for interactive statistics on your class.\n');
	// Delete Full Filenames
	return del(trackr.files).then(function (){
		fs.emptyDir('./output');
	});
}).catch(function (error) {
    console.error(error);
}).progress(function (progress) {
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write(' Processing ' + progress.percent + ' '+ progress.time + ' / ' + progress.duration + ' ' + progress.srcfps + ' fps');
}).fin(function (){
	admin.app().delete();
});