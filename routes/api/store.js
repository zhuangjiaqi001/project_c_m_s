const router  = require('express').Router()
const proxy   = require('../../proxy')
const Store    = proxy.Store
const Temp    = proxy.Temp
const Aliyun  = require('../../common/aliyun')
const Tools   = require('../../common/tools')
const Public  = require('../../common/public')
const Valid   = require('../../common/valid')
const Edit    = require('../../common/edit')
const swig    = require('swig')
const storeEdit  = Edit.Store
const storecEdit = Edit.StoreC
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

	Store.getStoreByQuery({
		'id':  id
	}, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		Tools.errHandle('0000', res, item)
	})
})
router.post('/addStore', (req, res, next) => {
	var id   = req.signedCookies.id,
		body = req.body,
		key  = body.key,
		name = body.name,
		description = body.description
	Valid.run(res, 'store', body, function() {
		Store.getStoreByQuery({
			'key':  key,
			'name': name
		}, function (item) {
			if (item) return Tools.errHandle('0123', res)

			Store.addStore(key, name, description, id, function (err) {
				if (err) return Tools.errHandle('0124', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/updateStore', (req, res, next) => {
	var body = req.body,
		id   = body.id

	var bodyFilter = Tools.bodyFilter(storeEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'storeUp', body, function() {
		Store.getStoreById(id, function (item) {
			if (!item) return Tools.errHandle('0128', res)
			Store.updateStore(id, body, function (err) {
				if (err) return Tools.errHandle('0130', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/removeStore', (req, res, next) => {
	var body = req.body,
		id   = body.id

	Store.getStoreById(id, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		if (item.active)  return Tools.errHandle('0134', res)
		Store.removeStore(id, function (err) {
			if (err) return Tools.errHandle('0130', res)
			Tools.errHandle('0000', res)
		})
	})
})


// 获取推荐位列表
router.get('/getStoreList', (req, res, next) => {
	var query  = req.query,
		select = ['key', 'name', 'description', 'id', 'createdAt', 'updatedAt']

	Store.getStoreList(query, select, function (items, pageInfo) {

		Tools.errHandle('0000', res, {
			list: items,
			pageInfo: pageInfo
		})
	})
})


// 创建推荐位内容
router.get('/getC', (req, res) => {
	var q      = req.query,
		id     = q.id,
		userId = req.signedCookies.id

	Store.getStoreCById(id, function(item) {
		if (!item) return Tools.errHandle('0163', res)
		Public.get.getTempShop(item, res, function(item) {
			Tools.errHandle('0000', res, item)
		})
	})
})
router.get('/prevStoreC', (req, res, next) => {
	var q      = req.query,
		id     = q.id,
		userId = req.signedCookies.id

	Store.getStoreCById(id, function(item) {
		if (!item) return Tools.errHandle('0163', res)

		Public.get.getShopRender(item, res, function(html) {
			res.send(html)
		})
	})
})
router.post('/addStoreC', (req, res, next) => {
	var body   = req.body,
		userId = req.signedCookies.id,
		storeId = body.storeId,
		shopcId = body.shop.id,
		key    = `storec_${Date.now() + userId}`,
		html   = body.html? body.html: '',
		css    = '',
		js     = '',
		pathname = `storec/${key}`

	if (!storeId || !shopcId) return Tools.errHandle('0126', res)

	Public.set.uploadAliyun(body, pathname, res, function(body) {
		body.userId = userId
		body.shopcId = shopcId
		body.key    = key

		Store.addStoreC(body, function (err) {
			if (err) return Tools.errHandle('0123', res)
			Tools.errHandle('0000', res)
		})
	})
})
router.post('/updateStoreC', (req, res, next) => {
	var body    = req.body,
		id      = body.id,
		userId  = req.signedCookies.id,
		storeId = body.storeId,
		shopcId = body.shop.id,
		html    = body.html || '',
		css     = body.css  || '',
		js      = body.js   || ''
	
	var bodyFilter = Tools.bodyFilter(storecEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'storec', body, function() {
		Store.getStoreCById(id, function(item) {
			if (!item) return Tools.errHandle('0163', res)
			var key      = item.key,
				pathname = `storec/${key}`;
			Public.set.uploadAliyun(body, pathname, res, function(body) {
				Store.updateStoreC(id, body, function (err) {
					if (err) return Tools.errHandle('0130', res)
					Tools.errHandle('0000', res)
				})
			})
		})
	})
})
router.post('/removeStoreC', (req, res, next) => {
	var body = req.body

	Store.getStoreCByQuery(body, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		Store.removeStoreC(body.id, function (err) {
			if (err) return Tools.errHandle('0133', res)
			Tools.errHandle('0000', res)
		})
	})
})
router.post('/releaseStoreC', (req, res, next) => {
	var body     = req.body,
		id       = body.id
	Store.getStoreCById(id, (item) => {
		if (!item) return Tools.errHandle('0163', res)

		var pathname = `pagec/${item.key}`
		Public.get.getShopRender(item, res, function(html) {
			Aliyun.uploadFile(html, 'ol.html', pathname, function(err, url) {
				if (err) return Tools.errHandle('0118', res)
				Store.updateStoreC(id, { active: 1, url: url }, function(err) {
					if (err) return Tools.errHandle('0170', res)
					Tools.errHandle('0000', res)
				})
			})
		})
	})
})
router.post('/offlineStoreC', (req, res, next) => {
	var body = req.body,
		id   = body.id
	Store.getStoreCById(id, (item) => {
		if (!item) return Tools.errHandle('0163', res)

		var mt   = item.url.match(/\/cms.+/),
			path = mt? mt[0]: ''
		if (!path) return Tools.errHandle('0130', res)
		Aliyun.delete(path, function(err, result) {
			if (err) return Tools.errHandle('0130', res)
			Store.updateStoreC(id, { active: 0 }, function(err) {
				if (err) return Tools.errHandle('0130', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/copyStoreC', (req, res, next) => {
	var body = req.body

	Store.getStoreCByQuery(body, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		item = item.dataValues
		var da = {
			key:         `storec_${Date.now() + item.userId}`,
			storeId:     item.storeId,
			shopcId:     item.shopcId,
			userId:      item.userId,
			title:       `${item.title}_copy_${Date.now()}`,
			html:        item.html,
			url:         item.url,
			json:        item.json,
			active:      item.active,
		}
		Store.addStoreC(da, function (err) {
			if (err) return Tools.errHandle('0123', res)
			Tools.errHandle('0000', res)
		})
	})
})

// 获取推荐位内容列表
router.get('/getStoreCList', (req, res, next) => {
	var query  = req.query
	var select = ['storeId', 'key', 'title', 'active', 'url', 'createdAt', 'updatedAt']
	Store.getStoreCList(query, select, function (items, pageInfo) {
		Tools.errHandle('0000', res, {
			list: items,
			pageInfo: pageInfo
		})
	})
})

module.exports = router