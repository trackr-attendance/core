var video = require('./video');
var upload = require('./upload');
var faces = require('./faces');
var faceIsolation = require('./faceIsolation');
var del = require('del');

video.stills('testClass.mov').then(function (filenames) {
    console.log(filenames);
    return filenames;
}).then(function(filenames){
	// Delete Full Filenames
	return del(files);
}).catch(function (error) {
    console.error(error);
}).progress(function (progress) {
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write(' Processing ' + progress.percent + ' '+ progress.time + ' / ' + progress.duration + ' ' + progress.srcfps + ' fps');
});