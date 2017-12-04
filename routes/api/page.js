const router  = require('express').Router()
const Cache   = require('../../models/cache')
const proxy   = require('../../proxy')
const Page    = proxy.Page
const Aliyun  = require('../../common/aliyun')
const Tools   = require('../../common/tools')
const Valid   = require('../../common/valid')
const Edit    = require('../../common/edit')
const swig    = require('swig')
const pageEdit  = Edit.Page
const pagecEdit = Edit.PageC
const tpl       = swig.compileFile('template/t0.html', { autoescape: false })
const tprev     = swig.compileFile('template/tp.html', { autoescape: false })

// 创建推荐位
router.post('/addPage', (req, res, next) => {
	var id   = req.signedCookies.id,
		body = req.body,
		key  = body.key,
		name = body.name,
		description = body.description
	Valid.run(res, 'page', body, function() {
		Page.getPageByQuery({
			'key':  key,
			'name': name
		}, function (item) {
			if (item) return Tools.errHandle('0123', res)
			Page.addPage(key, name, description, id, function (err) {
				if (err) return Tools.errHandle('0124', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/updatePage', (req, res, next) => {
	var body = req.body,
		id   = body.id

	var bodyFilter = Tools.bodyFilter(pageEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'pageUp', body, function() {
		Page.getPageById(id, function (item) {
			if (!item) return Tools.errHandle('0128', res)
			Page.updatePage(id, body, function (err) {
				if (err) return Tools.errHandle('0130', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/removePage', (req, res, next) => {
	var body = req.body,
		id   = body.id

	Page.getPageById(id, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		if (item.active)  return Tools.errHandle('0134', res)
		Page.removePage(id, function (err) {
			if (err) return Tools.errHandle('0130', res)
			Tools.errHandle('0000', res)
		})
	})
})


// 获取推荐位列表
router.get('/getPageList', (req, res, next) => {
	var query  = req.query,
		select = ['key', 'name', 'description', 'id', 'createdAt', 'updatedAt']

	Page.getPageList(query, select, function (items, pageInfo) {

		Tools.errHandle('0000', res, {
			list: Tools.dateToStr(items),
			pageInfo: pageInfo
		})
	})
})


// 创建推荐位内容
router.post('/addPageC', (req, res, next) => {
	var body   = req.body,
		userId = req.signedCookies.id,
		id     = body.id,
		pageId = body.pageId,
		key    = Date.now() + userId,
		html   = body.html? decodeURIComponent(body.html): '',
		css    = body.css?  decodeURIComponent(body.css):  '',
		js     = body.js?   decodeURIComponent(body.js):   '',
		pathname = `pagec/${key}`

	if (!pageId) return Tools.errHandle('0126', res)

	Page.getPageById(pageId, function(item) {
		if (!item) return Tools.errHandle('0128', res)
		uploadAliyun(html, css, js, pathname, body, res, function(body) {
			body.userId = userId
			debugger
			Page.addPageC(body, function (err) {
				if (err) return Tools.errHandle('0123', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/updatePageC', (req, res, next) => {
	var body   = req.body,
		pageId = body.pageId,
		userId = req.signedCookies.id,
		key    = body.key,
		id     = body.id,
		html   = body.html? decodeURIComponent(body.html): '',
		css    = body.css?  decodeURIComponent(body.css):  '',
		js     = body.js?   decodeURIComponent(body.js):   '',
		pathname = `pagec/${key}`

	var bodyFilter = Tools.bodyFilter(pagecEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'pagec', body, function() {
		Page.getPageCByQuery({
			pageId: pageId,
			id: id
		}, function(item) {
			if (!item) return Tools.errHandle('0128', res)
			uploadAliyun(html, css, js, pathname, body, res, function(body) {
				body.userId = userId
				Page.updatePageC(id, body, function (err) {
					if (err) return Tools.errHandle('0130', res)
					Tools.errHandle('0000', res)
				})
			})
			
		})
	})
})
router.post('/removePageC', (req, res, next) => {
	var body = req.body

	Page.getPageCByQuery(body, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		Page.removePageC(body.id, function (err) {
			if (err) return Tools.errHandle('0133', res)
			Tools.errHandle('0000', res)
		})
	})
})


// 获取推荐位内容列表
router.get('/getPageCList', (req, res, next) => {
	var query  = req.query
	var select = ['pageId', 'key', 'title', 'preview', 'createdAt', 'updatedAt']
	Page.getPageCList(query, select, function (items, pageInfo) {
		Tools.errHandle('0000', res, {
			list: Tools.dateToStr(items),
			pageInfo: pageInfo
		})
	})
})


function datafilter() {
	// body...
}
function uploadAliyun(html, css, js, pathname, body, res, cb) {
	var len = 0, now = 0
	body.html = body.css = body.js = ''
	if (html) ++len
	if (css)  ++len
	if (js)   ++len
	if (!len) cb(body)

	if (html) {
		Aliyun.uploadFile(html, '0.html', pathname, function(err, url) {
			if (err) return Tools.errHandle('0115', res)
			body.html = url
			++now
			if (now === len) cb(body)
		})
	}
	if (css) {
		Aliyun.uploadFile(css, '0.css', pathname, function(err, url) {
			if (err) return Tools.errHandle('0116', res)
			body.css = url
			++now
			if (now === len) cb(body)
		})
	}
	if (js) {
		Aliyun.uploadFile(js, '0.js', pathname, function(err, url) {
			if (err) return Tools.errHandle('0117', res)
			body.js = url
			++now
			if (now === len) cb(body)
		})
	}
}
function createPrev(body, pathname, res, cb) {
	var prev = tprev({
		title:   `${body.title}_${body.name}`,
		jsframe: Tools.getJSFrame(),
		items:   body.custemItems,
		body:    html,
		css:     body.css,
		js:      body.js
	})
	Aliyun.uploadFile(prev, 'prev.html', pathname, function(err, url) {
		if (err) return Tools.errHandle('0118', res)
		body.preview = url
		cb(body)
	})
}

module.exports = router