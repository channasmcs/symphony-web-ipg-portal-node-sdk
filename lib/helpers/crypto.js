var crypto = require('crypto');

function createHashSha256(value) {
	const hash = crypto.createHash('sha256').update(value).digest('hex');
	return hash;
}

function createHashMD5(value) {
	const hash = crypto.createHash('md5').update(value).digest('hex');
	return hash;
}

module.exports = { createHashSha256, createHashMD5 };
