const router  = require('express').Router()
const proxy   = require('../../proxy')
const Shop    = proxy.Shop
const Temp    = proxy.Temp
const Aliyun  = require('../../common/aliyun')
const Tools   = require('../../common/tools')
const Public  = require('../../common/public')
const Valid   = require('../../common/valid')
const Edit    = require('../../common/edit')
const swig    = require('swig')
const shopEdit  = Edit.Shop
const shopcEdit = Edit.ShopC
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
		userId = req.signedCookies.id,
		temps  = {}

	Shop.getShopCById(id, function(item) {
		if (!item) return Tools.errHandle('0128', res)
		Public.get.getTempShop(item, res, function(item) {
			Tools.errHandle('0000', res, item)
		})
	})
})
router.post('/addShopC', (req, res, next) => {
	var body   = req.body,
		userId = req.signedCookies.id,
		shopId = body.shopId,
		key    = `shopc_${Date.now()}`,
		html   = body.html? body.html: '',
		css    = body.css?  body.css:  '',
		js     = body.js?   body.js:   '',
		pathname = `shopc/${key}`

	if (!shopId) return Tools.errHandle('0126', res)

	Shop.getShopById(shopId, function(item) {
		if (!item) return Tools.errHandle('0178', res)

		Public.set.uploadAliyun(body, pathname, res, function(body) {
			body.userId = userId
			body.key    = key

			Shop.addShopC(body, function (err) {
				if (err) return Tools.errHandle('0123', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.get('/prevShopC', (req, res, next) => {
	var q      = req.query,
		id     = q.id,
		userId = req.signedCookies.id

	Shop.getShopCById(id, function(item) {
		if (!item) return Tools.errHandle('0163', res)
		var key      = item.key,
			pathname = `shopc/${key}`;

		item.dataValues.renderType = 'shop_prev'
		Public.get.getShopRender(item, res, function(html) {
			res.send(html)
		})
	})
})
router.get('/editorShopC', (req, res, next) => {
	var q      = req.query,
		id     = q.id,
		userId = req.signedCookies.id

	Shop.getShopCById(id, function(item) {
		if (!item) return Tools.errHandle('0163', res)
		var key      = item.key,
			pathname = `shopc/${key}`;

		item.dataValues.renderType = 'shop_editor'
		Public.get.getShopRender(item, res, function(html) {
			res.send(html)
		})
	})
})
router.post('/updateShopC', (req, res, next) => {
	var body   = req.body,
		id     = body.id,
		userId = req.signedCookies.id,
		shopId = body.shopId,
		html   = body.html || '',
		css    = body.css  || '',
		js     = body.js   || ''
	
	var bodyFilter = Tools.bodyFilter(shopcEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'shopc', body, function() {
		Shop.getShopCById(id, function(item) {
			if (!item) return Tools.errHandle('0163', res)
			var key      = item.key,
				pathname = `shopc/${key}`;
			Public.set.uploadAliyun(body, pathname, res, function(body) {
				body.userId = userId

				Shop.updateShopC(id, body, function (err) {
					if (err) return Tools.errHandle('0130', res)
					Tools.errHandle('0000', res)
				})
			})
			// Tools.uploadAliyun(html, css, js, pathname, body, res, function(body) {
			// })
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
			key:         `shopc_${Date.now()}`,
			shopId:      item.shopId,
			userId:      item.userId,
			title:       `${item.title}_copy_${Date.now()}`,
			header:      { id: item.header },
			footer:      { id: item.footer },
			html:        item.html,
			js:          item.js,
			json:        item.json,
			css:         item.css,
			custemItems: item.custemItems,
			modelItems:  item.modelItems,
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

module.exports = router