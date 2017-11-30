const router  = require('express').Router()
const Cache   = require('../../models/cache')
const Tools   = require('../../common/tools')


// 图片推荐位列表
router.get('/img', (req, res, next) => {
	var key = req.query.k || ''
	Cache.get({
		key: key,
		db: 1,
		cb: function(e, o) {
			if (o) {
				return res.set({ 'Cache-Control': 'max-age=600' }).send(o)
			}
			return Tools.errHandle('0128', res)
		}
	})
})


// 文字推荐位列表
router.get('/txt', (req, res, next) => {
	var key = req.query.k || ''
	Cache.get({
		key: key,
		db: 2,
		cb: function(e, o) {
			if (o) return res.set({ 'Cache-Control': 'max-age=600' }).send(o)
			return Tools.errHandle('0128', res)
		}
	})
})

module.exports = router