const router  = require('express').Router()
const Cache   = require('../../models/cache')
const proxy   = require('../../proxy')
const Temp   = proxy.Temp
const Tools   = require('../../common/tools')
const Valid   = require('../../common/valid')
const Edit    = require('../../common/edit')
const tempEdit  = Edit.Temp
const tempcEdit = Edit.TempC

// 创建推荐位
router.post('/addTemp', (req, res, next) => {
	var id   = req.signedCookies.id,
		body = req.body,
		key  = body.key,
		name = body.name,
		description = body.description,
		custemItems = body.custemItems || []

	Valid.run(res, 'temp', body, function() {
		Temp.getTempByQuery({
			'key':  key,
			'name': name
		}, function (item) {
			if (item) return Tools.errHandle('0123', res)

			Temp.addTemp(key, name, description, custemItems, id, function (err) {
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
			list: Tools.dateToStr(items),
			pageInfo: pageInfo
		})
	})
})


// 创建推荐位内容
router.post('/addTempC', (req, res, next) => {
	var body  = req.body,
		id    = req.signedCookies.id,
		tempId  = body.tempId,
		title = body.title,
		key   = body.key,
		imageUrl    = body.imageUrl,
		custemItems = body.custemItems

	if (!tempId) return Tools.errHandle('0126', res)

	Temp.getTempById(tempId, function(item) {
		if (!item) return Tools.errHandle('0128', res)
		Temp.addTempC(body, function (err) {
			if (err) return Tools.errHandle('0123', res)
			Tools.errHandle('0000', res)
		})
	})
})
router.post('/updateTempC', (req, res, next) => {
	var body  = req.body,
		tempId  = body.tempId,
		id    = body.id

	var bodyFilter = Tools.bodyFilter(tempcEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'tempc', body, function() {
		Temp.getTempCByQuery({
			tempId: tempId,
			id: id
		}, function(item) {
			if (!item) return Tools.errHandle('0128', res)
			Temp.updateTempC(id, body, function (err) {
				if (err) return Tools.errHandle('0130', res)
				Tools.errHandle('0000', res)
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
			list: Tools.dateToStr(items),
			pageInfo: pageInfo
		})
	})
})

module.exports = router