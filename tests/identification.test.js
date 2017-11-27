var identify = require('../identification');

collection = 'MIT-1.125-2017';

describe('identify faces', () => {
	test('identify photo from training set', () => {
		expect.assertions(1);
		return identify.match(collection, 'tests/identification.trainedFace.jpg').then(function (data){
			expect(data).toEqual(expect.objectContaining({
				name: 'MIT-1.125-2017-13-Aramael-PenaAlcantara'
			}));
		});
	});
	test('identify photo not in training set but of known individual', () => {
		expect.assertions(1);
		return identify.match(collection, 'tests/identification.knownFace.jpg').then(function (data){
			expect(data).toEqual(expect.objectContaining({
				name: 'MIT-1.125-2017-13-Aramael-PenaAlcantara'
			}));
		});
	});
	test('fail to identify unknown individual', () => {
		expect.assertions(1);
		return expect(identify.match(collection, 'tests/identification.unknownFace.jpg')).rejects.toHaveProperty('message','Individual not recognized');
	});
});

describe('engagement scores', () => {
	test('engaged individual', () => {
		expect.assertions(1);
		return identify.engagement('tests/identification.engagedFace.jpg').then(function (data){
			expect(data).toEqual(expect.objectContaining({
				engagement: expect.any(Number)
			}));
		});
	});
	test('unengaged individual', () => {
		expect.assertions(1);
		return identify.engagement('tests/identification.unengagedFace.jpg').then(function (data){
			expect(data).toEqual(expect.objectContaining({
				engagement: expect.any(Number)				
			}));
		});
	});
});