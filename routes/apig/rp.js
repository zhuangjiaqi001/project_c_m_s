const router  = require('express').Router()
const Cache   = require('../../models/cache')
const Tools   = require('../../common/tools')
const config  = require('../../config')

router.get('*', (req, res, next) => {
	var RP  = /localhost|mjmobi\.com|weimob\.(com|net)|luodibao\.com\.cn/,
		ORG = req.headers.origin
	res.header('Access-Control-Allow-Origin',  (RP.test(ORG) || config.env !== 'production')? ORG: '')
	res.header('Access-Control-Allow-Methods', 'GET')
	res.header('Access-Control-Allow-Headers', 'x-requested-with')
	res.header('Access-Control-Allow-Credentials', true)
	res.header('Cache-Control', 'max-age=600')
	next()
})


// 图片推荐位列表
router.get('/img', (req, res, next) => {
	var q    = req.query,
		key  = 'imgrp_' + (q.k || ''),
		get  = 'get'//,
		// cb   = q.cb || ''
	if (!key) return Tools.errHandle('0128', res)
	if (/\,/.test(key)) {
		key = key.split(',')
		get = 'mget'
	}
	Cache[get]({
		key: key, db: 1,
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
	var q    = req.query,
		key  = 'txtrp_' + (q.k || ''),
		get  = 'get'//,
		// cb   = q.cb || ''
	if (!key) return Tools.errHandle('0128', res)
	if (/\,/.test(key)) {
		key = key.split(',')
		get = 'mget'
	}
	Cache[get]({
		key: key, db: 1,
		cb: function(e, o) {
			if (e) return Tools.errHandle('0128', res)
			var da = { code: '0000', data: o }
			// if (cb) da = `${cb}(${JSON.stringify(o)})`
			return res.send(da)
		}
	})
})

module.exports = router