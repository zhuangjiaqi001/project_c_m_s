const router  = require('express').Router()
const Cache   = require('../../models/cache')
const proxy   = require('../../proxy')
const Temp    = proxy.Temp
const Aliyun  = require('../../common/aliyun')
const Tools   = require('../../common/tools')
const Public  = require('../../common/public')
const Valid   = require('../../common/valid')
const Edit    = require('../../common/edit')
const swig    = require('swig')
const tempEdit  = Edit.Temp
const tempcEdit = Edit.TempC
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

	Temp.getTempByQuery({
		'id':  id
	}, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		Tools.errHandle('0000', res, item)
	})
})
router.post('/addTemp', (req, res, next) => {
	var id   = req.signedCookies.id,
		body = req.body,
		key  = body.key,
		name = body.name,
		description = body.description
	Valid.run(res, 'temp', body, function() {
		Temp.getTempByQuery({
			'key':  key,
			'name': name
		}, function (item) {
			if (item) return Tools.errHandle('0123', res)
			Temp.addTemp(key, name, description, id, function (err) {
				if (err) return Tools.errHandle('0124', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/updateTemp', (req, res, next) => {
	var body = req.body,
		id   = body.id

	var bodyFilter = Tools.bodyFilter(tempEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'tempUp', body, function() {
		Temp.getTempById(id, function (item) {
			if (!item) return Tools.errHandle('0128', res)
			Temp.updateTemp(id, body, function (err) {
				if (err) return Tools.errHandle('0130', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/removeTemp', (req, res, next) => {
	var body = req.body,
		id   = body.id

	Temp.getTempById(id, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		if (item.active)  return Tools.errHandle('0134', res)
		Temp.removeTemp(id, function (err) {
			if (err) return Tools.errHandle('0130', res)
			req.body = item
			Tools.errHandle('0000', res)
		})
	})
})


// 获取推荐位列表
router.get('/getTempList', (req, res, next) => {
	var query  = req.query,
		select = ['key', 'name', 'description', 'id', 'createdAt', 'updatedAt']

	Temp.getTempList(query, select, function (items, pageInfo) {

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
		tempId = q.tempId,
		userId = req.signedCookies.id

	Temp.getTempCById(id, function(item) {
		if (!item) return Tools.errHandle('0163', res)

		Public.get.getAliyun(item, res, function(item) {
			Tools.errHandle('0000', res, item)
		})
	})
})
router.get('/prevTempC', (req, res, next) => {
	var q      = req.query,
		id     = q.id,
		userId = req.signedCookies.id

	Temp.getTempCById(id, function(item) {
		if (!item) return Tools.errHandle('0163', res)

		item.dataValues.renderType = 'temp_prev'
		Public.get.getShopRender(item, res, function(html) {
			res.send(html)
		})
	})
})
router.post('/addTempC', (req, res, next) => {
	var body   = req.body,
		userId = req.signedCookies.id,
		tempId = body.tempId,
		key    = `tempc_${Date.now()}`,
		html   = body.html? body.html: '',
		css    = body.css?  body.css:  '',
		js     = body.js?   body.js:   '',
		pathname = `tempc/${key}`

	body.custemItems = body.custemItems || []

	if (!tempId) return Tools.errHandle('0126', res)

	Public.set.uploadAliyun(body, pathname, res, function(body) {
		body.userId = userId
		body.key = key
		Temp.addTempC(body, function (err) {
			if (err) return Tools.errHandle('0123', res)
			Tools.errHandle('0000', res)
		})
	})
})
router.post('/updateTempC', (req, res, next) => {
	var body   = req.body,
		id     = body.id,
		userId = req.signedCookies.id,
		tempId = body.tempId,
		html   = body.html || '',
		css    = body.css  || '',
		js     = body.js   || ''

	body.custemItems = body.custemItems || []
	
	var bodyFilter = Tools.bodyFilter(tempcEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'tempc', body, function() {
		Temp.getTempCById(id, function(item) {
			if (!item) return Tools.errHandle('0163', res)
			var key      = item.key,
				pathname = `tempc/${key}`;
			Public.set.uploadAliyun(body, pathname, res, function(body) {
				body.userId = userId
				Temp.updateTempC(id, body, function (err) {
					if (err) return Tools.errHandle('0130', res)
					Tools.errHandle('0000', res)
				})
			})
		})
	})
})
router.post('/removeTempC', (req, res, next) => {
	var body = req.body

	Temp.getTempCByQuery(body, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		Temp.removeTempC(body.id, function (err) {
			if (err) return Tools.errHandle('0133', res)
			req.body = item
			Tools.errHandle('0000', res)
		})
	})
})
router.post('/copyTempC', (req, res, next) => {
	var body = req.body

	Temp.getTempCByQuery(body, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		item = item.dataValues
		var nd = Date.now(),
			da = {
			key:         `tempc_${nd}`,
			tempId:      item.tempId,
			userId:      item.userId,
			title:       `${item.title}_copy_${nd}`,
			html:        item.html,
			js:          item.js,
			css:         item.css,
			custemItems: item.custemItems,
			type:        item.type,
		}
		Temp.addTempC(da, function (err) {
			if (err) return Tools.errHandle('0123', res)
			req.body = da
			Tools.errHandle('0000', res)
		})
	})
})


// 获取推荐位内容列表
router.get('/getTempCList', (req, res, next) => {
	var query  = req.query
	var select = ['tempId', 'key', 'title', 'createdAt', 'updatedAt']
	Temp.getTempCList(query, select, function (items, pageInfo) {
		Tools.errHandle('0000', res, {
			list: items,
			pageInfo: pageInfo
		})
	})
})

module.exports = router