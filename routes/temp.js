const router  = require('express').Router()
const proxy   = require('../proxy')
const Tools   = require('../common/tools')
const Temp    = proxy.Temp
const Aliyun  = require('../common/aliyun')

// 列表
router.get('/', (req, res, next) => {
	res.render('temp')
})

// 创建
router.get('/add', (req, res, next) => {
	res.render('temp/add')
})
// 编辑
router.get('/edit', (req, res, next) => {
	res.render('temp/add')
})

// 模板类内容列表
router.get('/list', (req, res, next) => {
	res.render('temp/list')
})

// 模板类内容创建
router.get('/itemAdd', (req, res, next) => {
	res.render('temp/itemAdd')
})

// 模板类内容编辑
router.get('/itemEdit', (req, res, next) => {
	res.render('temp/itemAdd')
})

function getAliyun(body, pathname, res, cb) {
	var len  = 0,
		now  = 0,
		html = body.html,
		css  = body.css,
		js   = body.js
	if (html) ++len
	if (css)  ++len
	if (js)   ++len
	if (!len) cb(body)

	if (html) {
		Aliyun.getFile(`${pathname}/0.html`, function(err, result) {
			if (err) return Tools.errHandle('0105', res)
			body.html = result
			++now
			if (now === len) cb(body)
		})
	}
	if (css) {
		Aliyun.getFile(`${pathname}/0.css`, function(err, result) {
			if (err) return Tools.errHandle('0106', res)
			body.css = result
			++now
			if (now === len) cb(body)
		})
	}
	if (js) {
		Aliyun.getFile(`${pathname}/0.js`, function(err, result) {
			if (err) return Tools.errHandle('0107', res)
			body.js = result
			++now
			if (now === len) cb(body)
		})
	}
}


module.exports = router
