var output = require('./output.json');

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

console.log(engagement);