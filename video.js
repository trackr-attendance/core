var Q = require('q')
var spawn  = require('child_process').spawn;
var flatten = require('array-flatten');
var timecodes = require('node-timecodes');
const uuidv4 = require('uuid/v4');
const fs = require('fs-extra')
var klawSync = require('klaw-sync')
const path = require('path')

exports.stills = function (movie){
    var deferred = Q.defer();

    var prefix = uuidv4();
    var command = spawn('ffmpeg', ['-i', movie, '-vf', "select='not(mod(n\\,1800))'", '-vsync', 'vfr', prefix+'%04d.png', '-hide_banner']);

    var progressTemplate = {}
	command.stderr.on('data', function (data) {
		if (data.toString().indexOf('Duration:') !== -1){
			var match = data.toString().match(/([\d.]+) fps/i);
			if (match){
				progressTemplate.srcfps = parseFloat(match[1]);
			}

			var match = data.toString().match(/Duration: ([\d:.]+)/i);
			if (match){
				progressTemplate.duration = match[1].substring(0, match[1].indexOf("."))+':00';
				progressTemplate.durationSec = timecodes.toSeconds(progressTemplate.duration, progressTemplate.srcfps);
			}
		}
		if (data.toString().indexOf('frame=') !== -1){

			// Flatten Progress Arguments
			cleanData = flatten(data.toString().split("=").map(function (item){ return item.split(" ")})).filter(function (item){return (item !== '' && item !== '\r');});
			var progress = Object.assign({}, progressTemplate);
			cleanData.forEach(function(val, i) {
				if (i % 2 === 1) return;
				progress[val] = cleanData[i + 1];
			});
			progress.time = progress.time.substring(0, progress.time.indexOf("."))+':00'
			progress.timeSec = timecodes.toSeconds(progress.time, progress.srcfps);
			progress.percent = progress.timeSec / progress.durationSec;
			deferred.notify(progress);
		}
	});

	command.on('exit', function (code) {
		if (code == 0){
			// Find All Generated Files
			var files = klawSync('./', {
				nodir: true,
				filter: item => item.path.indexOf(prefix) > 0 && path.extname(item.path) === '.png',
				noRecurseOnFailedFilter: true
			}).map(file => file.path);
			deferred.resolve(files);
		} else {
			deferred.reject(new Error('child process exited with code ' + code.toString()));			
		}
	});

    return deferred.promise;
}