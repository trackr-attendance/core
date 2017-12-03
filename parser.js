var output = require('./output.json');

var simpleAttendance = output.attendance.map(function (snapshot) {
	return snapshot.attendance.map(function (student){
		if (!("id" in student) || (typeof student.id == 'undefined')){
			return -1;
		}else {
			return student.id
		}
	});
});

// Quick Recognition
var recognised = new Set([].concat.apply([], simpleAttendance));
recognised.delete(-1);
console.log(recognised);

// Frequency Map:
attendance = {};
output.roster.students.forEach(function (student){
	attendance[student.id] = {
		first: student.first,
		last: student.last,
		attendance: Array.from(new Array(simpleAttendance.length), (x,i) => 0)
	};
});

simpleAttendance.forEach(function (snapshot, index){
	snapshot.forEach(function (student){
		if (student > 0){
			attendance[student]['attendance'][index] = 1;
		}
	});
});

Object.keys(attendance).forEach(function(key) {
    console.log(attendance[key]['first'] + ' ' + attendance[key]['last'],',', attendance[key]['attendance'].join(', '));
});