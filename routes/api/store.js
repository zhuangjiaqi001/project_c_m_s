const router  = require('express').Router()
const proxy   = require('../../proxy')
const Store    = proxy.Store
const Temp    = proxy.Temp
const Aliyun  = require('../../common/aliyun')
const Tools   = require('../../common/tools')
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
router.get('/getC', (req, res, next) => {
	var q      = req.query,
		id     = q.id,
		userId = req.signedCookies.id,
		temps  = {}

	Store.getStoreCByQuery({
		id: id
	}, function(item) {
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

				Tools.getAliyun(item, res, function(item) {
					Tools.errHandle('0000', res, item)
				})
			})
		})
	})
})
router.post('/addStoreC', (req, res, next) => {
	var body   = req.body,
		userId = req.signedCookies.id,
		storeId = body.storeId,
		key    = `storec_${Date.now() + userId}`,
		html   = body.html? body.html: '',
		css    = body.css?  body.css:  '',
		js     = body.js?   body.js:   '',
		pathname = `storec/${key}`

	if (!storeId) return Tools.errHandle('0126', res)

	Store.getStoreById(storeId, function(item) {
		if (!item) return Tools.errHandle('0178', res)
		Tools.uploadAliyun(html, css, js, pathname, body, res, function(body) {
			body.userId = userId
			body.key    = key

			Store.addStoreC(body, function (err) {
				if (err) return Tools.errHandle('0123', res)
				Tools.errHandle('0000', res)
			})
			// datafilter(item, ['id', 'title', 'html', 'css', 'js', 'json', 'custemItems'], res, function(html) {
			// 	Aliyun.uploadFile(html, 'ol.html', pathname, function(err, url) {
			// 		if (err) return Tools.errHandle('0118', res)
			// 	})
			// })
		})
	})
})
router.get('/prevStoreC', (req, res, next) => {
	var q      = req.query,
		id     = q.id,
		userId = req.signedCookies.id

	Store.getStoreCByQuery({
		id: id
	}, function(item) {
		if (!item) return Tools.errHandle('0163', res)
		var key      = item.key,
			pathname = `storec/${key}`;

			datafilter(item, ['id', 'title', 'html', 'css', 'js', 'custemItems'], res, function(html) {
				res.send(html)
				// Aliyun.uploadFile(html, 'ol.html', pathname, function(err, url) {
				// 	if (err) return Tools.errHandle('0118', res)
				// })
			})
	})
})
router.post('/updateStoreC', (req, res, next) => {
	var body   = req.body,
		id     = body.id,
		userId = req.signedCookies.id,
		storeId = body.storeId,
		html   = body.html || '',
		css    = body.css  || '',
		js     = body.js   || ''
	
	var bodyFilter = Tools.bodyFilter(storecEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'storec', body, function() {
		Store.getStoreCByQuery({
			id: id
		}, function(item) {
			if (!item) return Tools.errHandle('0163', res)
			var key      = item.key,
				pathname = `storec/${key}`;
			Tools.uploadAliyun(html, css, js, pathname, body, res, function(body) {
				body.userId = userId

				Store.updateStoreC(id, body, function (err) {
					if (err) return Tools.errHandle('0130', res)
					Tools.errHandle('0000', res)
				})
				// datafilter(item, ['id', 'title', 'html', 'css', 'js', 'custemItems'], res, function(html) {
				// 	Aliyun.uploadFile(html, 'ol.html', pathname, function(err, url) {
				// 		if (err) return Tools.errHandle('0118', res)
				// 	})
				// })

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
router.post('/copyStoreC', (req, res, next) => {
	var body = req.body

	Store.getStoreCByQuery(body, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		item = item.dataValues
		var da = {
			key:         `${item.key}_copy_${Date.now()}`,
			storeId:      item.storeId,
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
		Store.addStoreC(da, function (err) {
			if (err) return Tools.errHandle('0123', res)
			Tools.errHandle('0000', res)
		})
	})
})

// 获取推荐位内容列表
router.get('/getStoreCList', (req, res, next) => {
	var query  = req.query
	var select = ['storeId', 'key', 'title', 'preview', 'createdAt', 'updatedAt']
	Store.getStoreCList(query, select, function (items, pageInfo) {
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
			if (item.css) css.push(item.css)
			if (item.js)  js.push(item.js)
			Tools.getAliyunHTML(temps, res, function(temps) {
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
// 创建页面
function createPage(body, res, cb) {
	var mi = typeof body.modelItems === 'string'? JSON.parse(body.modelItems): body.modelItems
	body.js.unshift( jsframe.vue_2_2_6, jsframe.jq_1_12_4, '/js/util/e-edit-view.js' )
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