const router  = require('express').Router()
const Cache   = require('../../models/cache')
const Tools   = require('../../common/tools')
const config  = require('../../config')

router.get('*', (req, res, next) => {
	var RP  = /localhost|mjmobi\.com|weimob\.(com|net)|luodibao\.com\.cn/,
		ORG = req.headers.origin
	res.header('Access-Control-Allow-Origin',  (RP.test(ORG) || config.env !== 'production')? '*': '')
	res.header('Access-Control-Allow-Methods', 'GET')
	res.header('Access-Control-Allow-Headers', 'x-requested-with')
	res.header('Access-Control-Allow-Credentials', true)
	res.header('Cache-Control', 'max-age=600')
	next()
})


// 图片推荐位列表
router.get('/img', (req, res, next) => {
	var q   = req.query,
		key = q.k,
		get = 'get'//,
		// cb   = q.cb || ''
	if (!key) return Tools.errHandle('0128', res)
	if (/\,/.test(key)) {
		key = key.split(',')
		key.map(function(i, _) {
			key[_] = 'imgrp_' + i
		})
		get = 'mget'
	} else {
		key = 'imgrp_' + key
	}
	Cache[get]({
		key: key, db: 2,
		cb: function(e, o) {
			if (e) return Tools.errHandle('0128', res)
			var da = { code: '0000', data: o }
			// if (cb) da = `${cb}(${JSON.stringify(o)})`
			return res.send(da)
		}
	})
})

// 文字推荐位列表
router.get('/txt', (req, res, next) => {
	var q   = req.query,
		key = key = q.k,
		get = 'get'//,
		// cb   = q.cb || ''
	if (!key) return Tools.errHandle('0128', res)
	if (/\,/.test(key)) {
		key = key.split(',')
		key.map(function(i, _) {
			key[_] = 'txtrp_' + i
		})
		get = 'mget'
	} else {
		key = 'txtrp_' + key
	}
	Cache[get]({
		key: key, db: 2,
		cb: function(e, o) {
			if (e) return Tools.errHandle('0128', res)
			var da = { code: '0000', data: o }
			// if (cb) da = `${cb}(${JSON.stringify(o)})`
			return res.send(da)
		}
	})
})

// 文字推荐位列表
router.get('/all', (req, res, next) => {
	var q   = req.query,
		key = key = q.k.replace(/\:/g, 'rp_'),
		get = 'get'//,
		// cb   = q.cb || ''
	if (!key) return Tools.errHandle('0128', res)
	if (/\,/.test(key)) {
		key = key.split(',')
		get = 'mget'
	}
	Cache[get]({
		key: key, db: 2,
		cb: function(e, o) {
			if (e) return Tools.errHandle('0128', res)
			var da = { code: '0000', data: o }
			// if (cb) da = `${cb}(${JSON.stringify(o)})`
			return res.send(da)
		}
	})
})

module.exports = router