const faceIsolation = require('./faceIsolation');
var fs = require('fs-extra');
var easyimg = require('easyimage');

var outputDir = './output';

test('simple crop box in center', () => {
	expect(faceIsolation.getFaceCropBox(100, 100, 45, 45, 10, 10, 2)).toEqual({width:20, height:20, x: 40, y: 40});
});
test('simple crop box in center right', () => {
	expect(faceIsolation.getFaceCropBox(100, 100, 90, 45, 10, 10, 2)).toEqual({width:15, height:20, x: 85, y: 40});
});
test('simple crop box in center left', () => {
	expect(faceIsolation.getFaceCropBox(100, 100, 0, 45, 10, 10, 2)).toEqual({width:15, height:20, x: 0, y: 40});
});
test('simple crop box in top center', () => {
	expect(faceIsolation.getFaceCropBox(100, 100, 45, 90, 10, 10, 2)).toEqual({width:20, height:15, x: 40, y: 85});
});
test('simple crop box in bottom center', () => {
	expect(faceIsolation.getFaceCropBox(100, 100, 45, 0, 10, 10, 2)).toEqual({width:20, height:15, x: 40, y: 0});
});

describe('get face crop arguments', () => {
	test('face crop arguments with defaults', () => {
		expect.assertions(1);
		return easyimg.info('faceIsolationTest.png').then(function (image){
			var face = require('./faceIsolationTestFaces.json')[0];
			expect(faceIsolation.getFaceCropArguments(image, face)).toEqual({
				src: 'faceIsolationTest.png',
				dst: './output/01.png',
				cropwidth: 20,
				cropheight: 20,
				gravity: 'NorthWest',
				x: 0,
				y: 0
			});
		});
	});

	test('face crop arguments with explicit output directory', () => {
		expect.assertions(1);
		return easyimg.info('faceIsolationTest.png').then(function (image){
			var face = require('./faceIsolationTestFaces.json')[0];
			expect(faceIsolation.getFaceCropArguments(image, face, './testOutputDirectory')).toEqual({
				src: 'faceIsolationTest.png',
				dst: './testOutputDirectory/01.png',
				cropwidth: 20,
				cropheight: 20,
				gravity: 'NorthWest',
				x: 0,
				y: 0
			});
		});
	});

	test('face crop arguments with explicit scale factor', () => {
		expect.assertions(1);
		return easyimg.info('faceIsolationTest.png').then(function (image){
			var face = require('./faceIsolationTestFaces.json')[0];
			expect(faceIsolation.getFaceCropArguments(image, face, null, 3)).toEqual({
				src: 'faceIsolationTest.png',
				dst: './output/01.png',
				cropwidth: 25,
				cropheight: 25,
				gravity: 'NorthWest',
				x: 0,
				y: 0
			});
		});
	});

	test('face crop arguments with explicit output directory and scale factor', () => {
		expect.assertions(1);
		return easyimg.info('faceIsolationTest.png').then(function (image){
			var face = require('./faceIsolationTestFaces.json')[0];
			expect(faceIsolation.getFaceCropArguments(image, face, './testOutputDirectory', 3)).toEqual({
				src: 'faceIsolationTest.png',
				dst: './testOutputDirectory/01.png',
				cropwidth: 25,
				cropheight: 25,
				gravity: 'NorthWest',
				x: 0,
				y: 0
			});
		});
	});
});

describe('face isolation test', () => {
	beforeEach(() => {
		// Create Output Directory
		if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
	});

	afterEach(() => {
		// Delete Generated Photos
		if (fs.existsSync(outputDir)) fs.removeSync(outputDir);
	});

	test('generate individual face photos', () => {
		expect.assertions(1);
		return faceIsolation.generateIndividualFacePhotos('faceIsolationTest.png', require('./faceIsolationTestFaces.json')).then(function(data){
			expect(data).toEqual(require('./faceIsolationTestFacesResult.json'));
		});
	});
});