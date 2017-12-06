const router  = require('express').Router()
const proxy   = require('../proxy')
const Tools   = require('../common/tools')
const Page    = proxy.Page
const Temp    = proxy.Temp
const Aliyun  = require('../common/aliyun')

// 列表
router.get('/', (req, res, next) => {
	res.render('page', {
		title: '落地页列表'
	})
})

// 创建
router.get('/add', (req, res, next) => {
	res.render('page/add', {
		title: '新建落地页列表'
	})
})
// 编辑
router.get('/edit', (req, res, next) => {
	res.render('page/add', {
		title: '编辑落地页列表'
	})
})

// 落地页列表内容列表
router.get('/list', (req, res, next) => {
	res.render('page/list', {
		title: '落地页列表列表'
	})
})

// 落地页列表内容创建
router.get('/itemAdd', (req, res, next) => {
	res.render('page/itemAdd', {
		title: '新建内容'
	})
})

// 落地页列表内容编辑
router.get('/itemEdit', (req, res, next) => {
	res.render('page/itemAdd', {
		title: '编辑内容'
	})
})

function getAliyun(body, res, cb) {
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
		var hmt = html.match(/(tempc|pagec)[\S]*html$/)[0]
		Aliyun.getFile(hmt, function(err, result) {
			if (err) return Tools.errHandle('0105', res)
			body.html = result
			++now
			if (now === len) cb(body)
		})
	}
	if (css) {
		var cmt = css.match(/(tempc|pagec)[\S]*css$/)[0]
		Aliyun.getFile(cmt, function(err, result) {
			if (err) return Tools.errHandle('0106', res)
			body.css = result
			++now
			if (now === len) cb(body)
		})
	}
	if (js) {
		var jmt = js.match(/(tempc|pagec)[\S]*js$/)[0]
		Aliyun.getFile(jmt, function(err, result) {
			if (err) return Tools.errHandle('0107', res)
			body.js = result
			++now
			if (now === len) cb(body)
		})
	}
}


module.exports = router
