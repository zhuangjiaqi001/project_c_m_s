const router  = require('express').Router()
const Cache   = require('../../models/cache')
const proxy   = require('../../proxy')
const Shop    = proxy.Shop
const Aliyun  = require('../../common/aliyun')
const Tools   = require('../../common/tools')
const Valid   = require('../../common/valid')
const Edit    = require('../../common/edit')
const swig    = require('swig')
const shopEdit  = Edit.Shop
const shopcEdit = Edit.ShopC
const tpl       = swig.compileFile('template/t0.html', { autoescape: false })
const tprev     = swig.compileFile('template/tp.html', { autoescape: false })


var RP = {
	pn: /\S+cms\/[a-z]{2}\//
}

// 创建推荐位
router.get('/get', (req, res, next) => {
	var q      = req.query,
		id     = q.id,
		userId = req.signedCookies.id

	Shop.getShopByQuery({
		'id':  id
	}, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		Tools.errHandle('0000', res, item)
	})
})
router.post('/addShop', (req, res, next) => {
	var id   = req.signedCookies.id,
		body = req.body,
		key  = body.key,
		name = body.name,
		description = body.description
	Valid.run(res, 'shop', body, function() {
		Shop.getShopByQuery({
			'key':  key,
			'name': name
		}, function (item) {
			if (item) return Tools.errHandle('0123', res)

			Shop.addShop(key, name, description, id, function (err) {
				if (err) return Tools.errHandle('0124', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/updateShop', (req, res, next) => {
	var body = req.body,
		id   = body.id

	var bodyFilter = Tools.bodyFilter(shopEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'shopUp', body, function() {
		Shop.getShopById(id, function (item) {
			if (!item) return Tools.errHandle('0128', res)
			Shop.updateShop(id, body, function (err) {
				if (err) return Tools.errHandle('0130', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/removeShop', (req, res, next) => {
	var body = req.body,
		id   = body.id

	Shop.getShopById(id, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		if (item.active)  return Tools.errHandle('0134', res)
		Shop.removeShop(id, function (err) {
			if (err) return Tools.errHandle('0130', res)
			Tools.errHandle('0000', res)
		})
	})
})


// 获取推荐位列表
router.get('/getShopList', (req, res, next) => {
	var query  = req.query,
		select = ['key', 'name', 'description', 'id', 'createdAt', 'updatedAt']

	Shop.getShopList(query, select, function (items, pageInfo) {

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
		shopId = q.shopId,
		userId = req.signedCookies.id

	Shop.getShopCByQuery({
		shopId: shopId,
		id: id
	}, function(o) {
		var key      = o.key,
			pathname = `shopc/${key}`
		if (!o) return Tools.permit('对不起！该模板类不存在！', res)
		getAliyun(o, pathname, res, function(o) {
			Tools.errHandle('0000', res, o)
		})
	})
})
router.post('/addShopC', (req, res, next) => {
	var body   = req.body,
		id     = req.signedCookies.id,
		shopId = body.shopId,
		key    = body.key,
		html   = body.html? decodeURIComponent(body.html): '',
		css    = body.css?  decodeURIComponent(body.css):  '',
		js     = body.js?   decodeURIComponent(body.js):   '',
		pathname = `shopc/${key}`

	body.custemItems = body.custemItems || []

	if (!shopId) return Tools.errHandle('0126', res)

	Shop.getShopCByQuery({
		key: key
	}, function(item) {
		if (item) return Tools.errHandle('0163', res)
		uploadAliyun(html, css, js, pathname, body, res, function(body) {
			body.userId = id
			Shop.addShopC(body, function (err) {
				if (err) return Tools.errHandle('0123', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/updateShopC', (req, res, next) => {
	var body   = req.body,
		id     = body.id,
		userId = req.signedCookies.id,
		shopId = body.shopId,
		key    = `shopc_${Date.now() + userId}`,
		html   = body.html || '',
		css    = body.css  || '',
		js     = body.js   || '',
		pathname = `shopc/${key}`

	body.custemItems = body.custemItems || []
	
	var bodyFilter = Tools.bodyFilter(shopcEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'shopc', body, function() {
		Shop.getShopCByQuery({
			shopId: shopId,
			key: key
		}, function(item) {
			if (!item) return Tools.errHandle('0163', res)
			uploadAliyun(html, css, js, pathname, body, res, function(body) {
				body.userId = userId
				Shop.updateShopC(id, body, function (err) {
					if (err) return Tools.errHandle('0130', res)
					Tools.errHandle('0000', res)
				})
			})
		})
	})
})
router.post('/removeShopC', (req, res, next) => {
	var body = req.body

	Shop.getShopCByQuery(body, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		Shop.removeShopC(body.id, function (err) {
			if (err) return Tools.errHandle('0133', res)
			Tools.errHandle('0000', res)
		})
	})
})
router.post('/copyShopC', (req, res, next) => {
	var body = req.body

	Shop.getShopCByQuery(body, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		item = item.dataValues
		var da = {
			key:         `${item.key}_copy_${Date.now()}`,
			shopId:      item.shopId,
			userId:      item.userId,
			description: item.description,
			title:       `${item.title}_copy`,
			html:        item.html,
			js:          item.js,
			css:         item.css,
			custemItems: item.custemItems,
			type:        item.type,
			preview:     item.preview,
		}
		Shop.addShopC(da, function (err) {
			if (err) return Tools.errHandle('0123', res)
			Tools.errHandle('0000', res)
		})
	})
})


// 获取推荐位内容列表
router.get('/getShopCList', (req, res, next) => {
	var query  = req.query
	var select = ['shopId', 'key', 'title', 'preview', 'createdAt', 'updatedAt']
	Shop.getShopCList(query, select, function (items, pageInfo) {
		Tools.errHandle('0000', res, {
			list: items,
			pageInfo: pageInfo
		})
	})
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
			if (now === len) createPrev(html, body, pathname, res, cb)
		})
	}
	if (css) {
		Aliyun.uploadFile(css, '0.css', pathname, function(err, url) {
			if (err) return Tools.errHandle('0116', res)
			body.css = url
			++now
			if (now === len) createPrev(html, body, pathname, res, cb)
		})
	}
	if (js) {
		Aliyun.uploadFile(js, '0.js', pathname, function(err, url) {
			if (err) return Tools.errHandle('0117', res)
			body.js = url
			++now
			if (now === len) createPrev(html, body, pathname, res, cb)
		})
	}
}
function createPrev(html, body, pathname, res, cb) {
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