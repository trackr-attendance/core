const faceIsolation = require('./faceIsolation');

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