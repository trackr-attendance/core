var output = require('./output.json');

var simpleAttendance = output.attendance.map(function (snapshot) {
	return snapshot.attendance.map(function (student){
		if (!("id" in student) || (typeof student.id == 'undefined')){
			return -1;
		}else {
			return Number(student.id);
		}
	});
});

// Quick Recognition
var recognised = new Set([].concat.apply([], simpleAttendance));
recognised.delete(-1);
recognised = Array.from(recognised).sort();

//compile avg engagements from each frame
var engagement =  output.attendance.map(function(record, index){
	return {
		time: index + 1,
		score: record.attendance.reduce(function (accumulator, record, index){
			if (("engagement" in record) || (typeof record.engagement !== 'undefined')){
				var score = ((index)*accumulator + record.engagement)/(index+1);
				return score;
			}else{
				if (!accumulator){
					return 0;
				}
				return accumulator;
			}
		}, 0),
	}
});

console.log(recognised, engagement);