const router  = require('express').Router()
const Cache   = require('../../models/cache')
const Tools   = require('../../common/tools')


// 图片推荐位列表
router.get('/img', (req, res, next) => {
	var q    = req.query,
		key  = (q.k || ''),
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
			return res.set({ 'Cache-Control': 'max-age=600' }).send(da)
		}
	})
})

// 文字推荐位列表
router.get('/txt', (req, res, next) => {
	var q    = req.query,
		key  = (q.k || ''),
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
			return res.set({ 'Cache-Control': 'max-age=600' }).send(da)
		}
	})
})

module.exports = router