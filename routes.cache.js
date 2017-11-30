var config = require('./config')

var base64 = function(url) {
	return new Buffer(url).toString('base64')
}
var redis  = require('redis'),
	client = redis.createClient(config.redis)
module.exports = function (fn) {
	var expiredTime = config.cacheExpiredTime || 5000
	return function (req, res, next) {
		var send = res.send
		var url  = req.originalUrl
		var key  = base64(url)
		client.get(key, function (err, value) {
			if (err) {
				return next(err)
			}
			if (value) {
				var data = value
				try {
					data = JSON.parse(data)
				} catch (err) {
					console.log(err)
				}

				console.log('Read data from redis.')

				return res.send(data)
			}

			res.send = function (data) {
				client.setex(key, expiredTime, JSON.stringify(data))
				return send.call(this, data)
			}

			return fn.call(null, req, res, next)
		})
	}
}