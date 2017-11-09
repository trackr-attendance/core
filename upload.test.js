const upload = require('./upload');

describe('amazon s3 uploader', () => {
	test('image uploader', () => {

		expect.assertions(1);
		return upload.uploadFile('test001.jpg').then(data => {
			expect(data).toEqual(expect.objectContaining({
				Location: expect.stringContaining('https://trackr-attendance.s3.amazonaws.com/'),
				key: expect.any(String),
				Bucket: 'trackr-attendance'
			}));
		});
	});
});