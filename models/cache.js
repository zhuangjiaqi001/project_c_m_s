const config = require('../config')
const redis  = require('redis')
const Tools  = require('../common/tools')
const client = {
	0: redis.createClient(Tools.redisDB()),		// 用户信息
	1: redis.createClient(Tools.redisDB(1)),	// 图片推荐位
	2: redis.createClient(Tools.redisDB(2)),	// 文字推荐位
	3: redis.createClient(Tools.redisDB(3)),
}

module.exports = {
	get: function(opts) {
		var key = opts.key,
			db  = opts.db || 0,
			cb  = opts.cb
		if (key && cb) {
			console.log('===================== KEY =====================')
			console.log(key)
			client[db].get(key, function (err, data) {
				if (err) {
					console.log('查询信息失败!')
					return cb(err)
				}
				if (data) {
					console.log('查询 "'+key+'" 信息成功!')
					data = JSON.parse(data)
					console.log('===================== DATA =====================')
					console.log(data)
					return cb(null, data)
				} else {
					console.log('"'+key+'" 信息不存在!')
					return cb(1)
				}
			})
		} else {
			cb && cb(1)
		}
	},
	save: function(opts) {
		var key     = opts.key,
			data    = opts.data,
			db      = opts.db || 0,
			expired = opts.expired || 86400,
			cb      = opts.cb
		if (key && data && cb) {
			console.log('===================== KEY =====================')
			console.log(key)
			console.log('===================== DATA =====================')
			console.log(data)
			client[db].setex(key, expired, JSON.stringify(data), function(err, o) {
				if (err) {
					console.log('设置 "'+key+'" 信息失败!')
					return cb(err)
				}
				console.log('设置 "'+key+'" 信息成功!')
				return cb(null, o)
			})
		} else {
			cb && cb(1)
		}
	},
	set: function(opts) {
		var key  = opts.key,
			data = opts.data,
			db   = opts.db || 0,
			cb   = opts.cb
		if (key && data && cb) {
			console.log('===================== KEY =====================')
			console.log(key)
			console.log('===================== DATA =====================')
			console.log(data)
			client[db].set(key, JSON.stringify(data), function(err, o) {
				if (err) {
					console.log('设置 "'+key+'" 信息失败!')
					return cb(err)
				}
				console.log('设置 "'+key+'" 信息成功!')
				return cb(null, o)
			})
		} else {
			cb && cb(1)
		}
	},
	del: function(opts) {
		var key  = opts.key,
			db   = opts.db || 0,
			cb   = opts.cb
		if (key) {
			console.log('===================== KEY =====================')
			console.log(key)
			client[db].del(key, function(err, o) {
				if (err) {
					console.log('删除 "'+key+'" 失败!')
					return cb(err)
				}
				console.log('删除 "'+key+'" 成功!')
				return cb(null, o)
			})
		} else {
			cb && cb(1)
		}
	}
}