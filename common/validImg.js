const Schema = require('async-validator')
const Code   = require('./code')
const Tools  = require('./tools')
const proxy  = require('../proxy')
const Img    = proxy.Img

module.exports = function(type, userId, file, res, cb) {
	var path = file.path,
		ext  = path.match(/[^.]+$/)[0],
		name = 'cms_' + file.hash + '.' + ext
	Img.getImgByQuery({
		userId: userId,
		url: { $like: `%${name}%` }
	}, function(item) {
		if (item) {
			if (type === 1) {
				return Tools.errHandle('0000', res, {
					id:  item.id,
					url: item.url
				})
			} else if (type === 2) {
				res.send({
					url: item.url,
					state: 'SUCCESS'
				})
			}
		} else {
			cb && cb()
		}
	})
}

