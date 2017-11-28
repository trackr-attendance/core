var identify = require('../identification');
var admin = require("firebase-admin");

collection = 'MIT-1.125-2017';

describe('identify faces', () => {
	test('identify photo from training set', () => {
		expect.assertions(1);
		return identify.match(collection, 'tests/identification.trainedFace.jpg').then(function (data){
			expect(data).toEqual(expect.objectContaining({
				name: 'MIT-1.125-2017-13-Aramael-PenaAlcantara',
				confidence: expect.any(Number)
			}));
		});
	});
	test('identify photo not in training set but of known individual', () => {
		expect.assertions(1);
		return identify.match(collection, 'tests/identification.knownFace.jpg').then(function (data){
			expect(data).toEqual(expect.objectContaining({
				name: 'MIT-1.125-2017-13-Aramael-PenaAlcantara',
				confidence: expect.any(Number)
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
describe('generate connection database lookup for person', () => {
	beforeAll(() => {
		admin.initializeApp({
		    credential: admin.credential.cert(require("../trackr-attendance-d70b149c2ccc.json")),
		    databaseURL: "https://trackr-attendance.firebaseio.com"
		}); // default to new instance if not set
	});
	afterAll(() => {
		admin.app().delete();
	});
	test('person supplied database connection', () => {
		expect(identify.getPerson("MIT-1.125-2017-13-Aramael-PenaAlcantara")).resolves.toEqual(expect.objectContaining({
			id: expect.any(Number),
			first: expect.any(String),
			last: expect.any(String),
			username: expect.any(String)
		}));
	});
});
describe('person database lookup', () => {
	test('person reference', () => {
		expect(identify.makePersonReference('MIT-1.125-2017-13-Aramael-PenaAlcantara')).toEqual({
			ref: 'courses/MIT/1125/2017/roster/students/12',
			first: 'Aramael',
			last: 'PenaAlcantara'
		});
	});
	test('person ad-hoc database connection created', () => {
		expect(identify.getPerson("MIT-1.125-2017-13-Aramael-PenaAlcantara")).resolves.toEqual(expect.objectContaining({
			id: expect.any(Number),
			first: expect.any(String),
			last: expect.any(String),
			username: expect.any(String)
		}));
	});
});