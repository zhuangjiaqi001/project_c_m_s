const Schema = require('async-validator')
const Code   = require('./code')
const Tools  = require('./tools')
const Public = require('./public')
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
			res.req.body.fileUrl = item.url
			if (type !== item.type) return cb && cb()
			if (type === 1) {
				return Tools.errHandle('0000', res, {
					id:  item.id,
					url: item.url
				})
			} else if (type === 2) {
				Public.set.log(res.req, function() {
					res.send({
						url: item.url,
						state: 'SUCCESS'
					})
				})
			}
		} else {
			cb && cb()
		}
	})
}
