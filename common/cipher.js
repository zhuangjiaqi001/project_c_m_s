var crypto = require('crypto'),
	algorithm = 'aes-256-cbc',
	key = '@#$@!#167$!!!!!Weimob';

function encrypt(text) {
	var cipher = crypto.createCipher(algorithm, key);
	var crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

function decrypt(text) {
	var dec = null;
	try {
		var decipher = crypto.createDecipher(algorithm, key);
		dec = decipher.update(text, 'hex', 'utf8');
		dec += decipher.final('utf8');
	} catch (e) {

	}
	return dec;
}
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
