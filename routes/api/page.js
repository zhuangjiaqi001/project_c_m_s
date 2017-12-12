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

var RP = {
	pn: /\S+cms\/[a-z]{2}\//
}

// 创建推荐位
router.get('/get', (req, res, next) => {
	var q      = req.query,
		id     = q.id,
		userId = req.signedCookies.id

	Page.getPageById(id, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		Tools.errHandle('0000', res, item)
	})
})
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
			list: items,
			pageInfo: pageInfo
		})
	})
})


// 创建推荐位内容
router.get('/getC', (req, res, next) => {
	var q      = req.query,
		id     = q.id,
		userId = req.signedCookies.id,
		temps  = {}

	Page.getPageCByQuery({
		id: id
	}, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		item = item.dataValues
		Tools.getTempById(item, function(ids, item) {
			Temp.getTempCByRpIds(ids, ['id', 'title'], function(items, count) {
				items.map(function(i) {
					temps[i.id] = i
				})
				if (item.header) item.header = temps[item.header]
				if (item.footer) item.footer = temps[item.footer]
				if (item.modelItems) {
					var mi = []
					item.modelItems.map(function(i) {
						mi.push(temps[i])
					})
					item.modelItems = mi
				}

				getAliyun(item, res, function(item) {
					Tools.errHandle('0000', res, item)
				})
			})
		})
	})
})
router.post('/addPageC', (req, res, next) => {
	var body   = req.body,
		userId = req.signedCookies.id,
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
		if (item.active)  return Tools.errHandle('0174', res)
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
		select = ['title', 'url', 'active']
	Page.getPageCById(id, select, (item) => {
		if (!item) return Tools.errHandle('0128', res)
		var mt   = item.url.match(/\/cms.+/),
			path = mt? mt[0]: ''
		if (!path) return Tools.errHandle('0130', res)
		Aliyun.delete(path, function(err, result) {
			if (err) return Tools.errHandle('0130', res)
			Page.updatePageC(id, { active: 0 }, function(err) {
				if (err) return Tools.errHandle('0130', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/copyPageC', (req, res, next) => {
	var body = req.body

	Page.getPageCByQuery(body, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		item = item.dataValues
		var da = {
			key:         `${item.key}_copy_${Date.now()}`,
			pageId:      item.pageId,
			userId:      item.userId,
			description: item.description,
			title:       `${item.title}_copy`,
			html:        item.html,
			js:          item.js,
			css:         item.css,
			// url:         '',
			header:      { id: item.header },
			footer:      { id: item.footer },
			custemItems: item.custemItems,
			modelItems:  item.modelItems,
			type:        item.type,
			active:      false,
			width:       item.width
		}
		Page.addPageC(da, function (err) {
			if (err) return Tools.errHandle('0173', res)
			Tools.errHandle('0000', res)
		})
	})
})


// 获取推荐位内容列表
router.get('/getPageCList', (req, res, next) => {
	var query  = req.query
	var select = ['pageId', 'key', 'title', 'url', 'active', 'createdAt', 'updatedAt']
	Page.getPageCList(query, select, function (items, pageInfo) {
		Tools.errHandle('0000', res, {
			list: items,
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
				temps[i.id] = i
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
	var cis  = obj.custemItems
	if (cis.length) {
		cis.map(function(i) {
			js.push(jsframe[i.name])
		})
	}
	if (obj.css) css.push(obj.css)
	if (obj.js)  js.push(obj.js)
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
		Aliyun.getFile(html.replace(RP.pn, ''), function(err, result) {
			if (err) return Tools.errHandle('0105', res)
			body.html = result
			++now
			if (now === len) cb(body)
		})
	}
	if (css) {
		Aliyun.getFile(css.replace(RP.pn, ''), function(err, result) {
			if (err) return Tools.errHandle('0106', res)
			body.css = result
			++now
			if (now === len) cb(body)
		})
	}
	if (js) {
		Aliyun.getFile(js.replace(RP.pn, ''), function(err, result) {
			if (err) return Tools.errHandle('0107', res)
			body.js = result
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
		var mt = temps[p].html.replace(RP.pn, '')
		if (!mt) return
		Aliyun.getFile(mt, function(err, result) {
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
	var mi = typeof body.modelItems === 'string'? JSON.parse(body.modelItems): body.modelItems
	var prev = tpl({
		title:   `${body.title}`,
		body:    body.html,
		css:     body.css,
		js:      body.js,
		model:   mi,
		header:  body.header? body.header.html || '': '',
		footer:  body.footer? body.footer.html || '': '',
		width:   body.width || '1000'
	})
	cb && cb(prev)
}

module.exports = router