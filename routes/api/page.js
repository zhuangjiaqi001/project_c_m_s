const router  = require('express').Router()
const proxy   = require('../../proxy')
const Page    = proxy.Page
const Temp    = proxy.Temp
const Aliyun  = require('../../common/aliyun')
const Tools   = require('../../common/tools')
const Valid   = require('../../common/valid')
const Edit    = require('../../common/edit')
const swig    = require('swig')
const pageEdit  = Edit.Page
const pagecEdit = Edit.PageC
const tpl       = swig.compileFile('template/t0.html', { autoescape: false })
const tprev     = swig.compileFile('template/tp.html', { autoescape: false })
const jsframe   = Tools.getJSFrame()

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

	if (!pageId) return Tools.errHandle('0176', res)

	Page.getPageById(pageId, function(item) {
		if (!item) return Tools.errHandle('0178', res)
		uploadAliyun(html, css, js, pathname, body, res, function(body) {
			body.userId = userId
			body.key = key
			Page.addPageC(body, function (err) {
				if (err) return Tools.errHandle('0173', res)
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

	body.modelItems = body.modelItems || []
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
					if (err) return Tools.errHandle('0170', res)
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
router.post('/releasePageC', (req, res, next) => {
	var body     = req.body,
		id       = body.id,
		select   = ['key', 'title', 'width', 'header', 'footer', 'html', 'css', 'js', 'modelItems', 'active']
	Page.getPageCById(id, select, (item) => {
		if (!item) return Tools.errHandle('0178', res)
		var pathname = `pagec/${item.key}`
		datafilter(item, ['id', 'title', 'html', 'css', 'js', 'custemItems'], res, function(html) {
			Aliyun.uploadFile(html, 'ol.html', pathname, function(err, url) {
				if (err) return Tools.errHandle('0118', res)
				Page.updatePageC(id, { active: 1, url: url }, function(err) {
					if (err) return Tools.errHandle('0170', res)
					Tools.errHandle('0000', res)
				})
			})
		})
	})
})
router.post('/offlinePageC', (req, res, next) => {
	var body = req.body,
		id   = body.id,
		select = ['title', 'html', 'css', 'js', 'modelItems', 'active']
	PageC.getPageCById(id, (item) => {
		if (!item) return Tools.errHandle('0128', res)
		var key = Tools.hmac(item.key)
		PageC.updatePageC(id, { active: 0 })
		Cache.del({ key: key, db: 1, cb: (e, o) => {
			if (e) return Tools.errHandle('0142', res)
			Tools.errHandle('0000', res)
		}})
	})
})


// 获取推荐位内容列表
router.get('/getPageCList', (req, res, next) => {
	var query  = req.query
	var select = ['pageId', 'key', 'title', 'url', 'active', 'createdAt', 'updatedAt']
	Page.getPageCList(query, select, function (items, pageInfo) {
		Tools.errHandle('0000', res, {
			list: Tools.dateToStr(items),
			pageInfo: pageInfo
		})
	})
})

// 数据过滤
function datafilter(item, select, res, cb) {
	Tools.getTempById(item, function(ids, item) {
		Temp.getTempCByRpIds(ids, ['id', 'title', 'html', 'css', 'js', 'custemItems'], function(items, count) {
			var temps = {}, js = [], css = []
			items.map(function(i) {
				temps[i.dataValues.id] = i.dataValues
			})
			if (item.html) temps['body'] = { html: item.html }
			getAliyunHTML(temps, res, function(temps) {
				if (item.header) item.header = modelfilter(temps[item.header], js, css)
				if (item.modelItems) {
					var mi = []
					item.modelItems.map(function(i) {
						mi.push(modelfilter(temps[i], js, css))
					})
					item.modelItems = mi
				}
				if (item.footer) item.footer = modelfilter(temps[item.footer], js, css)
				item.js  = Tools.unique(js)
				item.css = Tools.unique(css)
				if (temps.body) item.html = temps['body'].html
				createPage(item, res, cb)
			})
		})
	})
}
// 模块过滤
function modelfilter(obj, js, css) {
	var cis  = obj.custemItems,
	cis = JSON.parse(cis)
	if (cis.length) {
		cis.map(function(i) {
			js.push(jsframe[i.name])
		})
	}
	if (obj.css) css.push(obj.css)
	return {
		html: obj.html
	}
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
function getAliyunHTML(temps, res, cb) {
	var len  = 0,
		now  = 0
	for (let p in temps) {
		if (!temps[p].html) return
		++len
		var mt = temps[p].html.match(/(tempc|pagec)[\S]*html$/)
		if (!mt) return
		var path = mt[0]
		Aliyun.getFile(path, function(err, result) {
			if (err) return Tools.errHandle('0105', res)
			temps[p].html = result
			++now
			if (now === len) return cb(temps)
		})
	}
	if (!len) return cb(temps)
}
// 创建页面
function createPage(body, res, cb) {
	var prev = tpl({
		title:   `${body.title}`,
		body:    body.html,
		css:     body.css,
		js:      body.js,
		model:   body.modelItems,
		header:  body.header.html || '',
		footer:  body.footer.html || '',
		width:   body.width || '1000'
	})
	cb && cb(prev)
}

module.exports = router