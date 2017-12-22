const router  = require('express').Router()
const proxy   = require('../../proxy')
const Page    = proxy.Page
const Temp    = proxy.Temp
const Aliyun  = require('../../common/aliyun')
const Tools   = require('../../common/tools')
const Public  = require('../../common/public')
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

	Page.getPageCById(id, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		Public.get.getTempShop(item, res, function(item) {
			Tools.errHandle('0000', res, item)
		})
	})
})
router.get('/prevPageC', (req, res, next) => {
	var q      = req.query,
		id     = q.id,
		userId = req.signedCookies.id

	Page.getPageCById(id, function(item) {
		if (!item) return Tools.errHandle('0163', res)

		Public.get.getShopRender(item, res, function(html) {
			res.send(html)
		})
	})
})
router.post('/addPageC', (req, res, next) => {
	var body   = req.body,
		userId = req.signedCookies.id,
		pageId = body.pageId,
		key    = `pagec_${Date.now()}`,
		html   = body.html || '',
		css    = body.css  || '',
		js     = body.js   || '',
		pathname = `pagec/${key}`

	if (!pageId) return Tools.errHandle('0176', res)

	Page.getPageById(pageId, function(item) {
		if (!item) return Tools.errHandle('0178', res)
		Public.set.uploadAliyun(body, pathname, res, function(body) {
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
		html   = body.html || '',
		css    = body.css  || '',
		js     = body.js   || '',
		pathname = `pagec/${key}`

	body.modelItems = body.modelItems || []
	var bodyFilter = Tools.bodyFilter(pagecEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'pagec', body, function() {
		Page.getPageCById(id, function(item) {
			if (!item) return Tools.errHandle('0128', res)
			Public.set.uploadAliyun(body, pathname, res, function(body) {
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
		id       = body.id;
	Page.getPageCById(id, (item) => {
		if (!item) return Tools.errHandle('0178', res)

		var pathname = `pagec/${item.key}`
		Public.get.getShopRender(item, res, function(html) {
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
		id   = body.id
	Page.getPageCById(id, (item) => {
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
			key:         `pagec_${Date.now()}`,
			pageId:      item.pageId,
			userId:      item.userId,
			title:       `${item.title}_copy_${Date.now()}`,
			html:        item.html,
			js:          item.js,
			css:         item.css,
			header:      { id: item.header },
			footer:      { id: item.footer },
			custemItems: item.custemItems,
			modelItems:  item.modelItems,
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


module.exports = router