const router  = require('express').Router()
const Cache   = require('../../models/cache')
const proxy   = require('../../proxy')
const ImgRP   = proxy.ImgRP
const Tools   = require('../../common/tools')
const Valid   = require('../../common/valid')
const Edit    = require('../../common/edit')
const rpEdit  = Edit.ImgRP
const rpcEdit = Edit.ImgRPC

// 创建推荐位
router.get('/get', (req, res, next) => {
	var q      = req.query,
		id     = q.id,
		userId = req.signedCookies.id

	ImgRP.getImgRPById(id, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		Tools.errHandle('0000', res, item)
	})
})
router.post('/addImgRP', (req, res, next) => {
	var id   = req.signedCookies.id,
		body = req.body,
		key  = body.key,
		name = body.name,
		description = body.description,
		custemItems = body.custemItems || []

	Valid.run(res, 'imgrp', body, function() {
		ImgRP.getImgRPByQuery({
			'key':  key,
			'name': name
		}, function (item) {
			if (item) return Tools.errHandle('0123', res)

			ImgRP.addImgRP(key, name, description, custemItems, id, function (err) {
				if (err) return Tools.errHandle('0124', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/updateImgRP', (req, res, next) => {
	var body = req.body,
		id   = body.id

	if (!body.custemItems) body.custemItems = []
	var bodyFilter = Tools.bodyFilter(rpEdit, body)
	body = bodyFilter.obj
	
	Valid.run(res, 'imgrpUp', body, function() {
		ImgRP.getImgRPById(id, function (item) {
			if (!item) return Tools.errHandle('0128', res)
			ImgRP.updateImgRP(id, body, function (err) {
				if (err) return Tools.errHandle('0130', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/removeImgRP', (req, res, next) => {
	var body = req.body,
		id   = body.id

	ImgRP.getImgRPById(id, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		if (item.active)  return Tools.errHandle('0134', res)
		ImgRP.removeImgRP(id, function (err) {
			if (err) return Tools.errHandle('0130', res)
			req.body = item
			Tools.errHandle('0000', res)
		})
	})
})
router.post('/releaseImgRP', (req, res, next) => {
	var body = req.body,
		id   = body.id,
		select = ['title', 'imageUrl', 'url', 'startTime', 'endTime', 'custemItems']
	ImgRP.getImgRPById(id, (item) => {
		if (!item) return Tools.errHandle('0128', res)
		var key = 'imgrp_' + Tools.hmac(item.key)
		ImgRP.updateImgRP(id, { active: 1 })
		ImgRP.getImgRPCByRpId(id, select, (items, count) => {
			Cache.set({ key: key, db: 2, data: {
					list:  items,
					total: count
				},
				cb: (e, o) => {
					if (e) return Tools.errHandle('0142', res)
					req.body = item
					Tools.errHandle('0000', res)
				}
			})
		})
	})
})
router.post('/offlineImgRP', (req, res, next) => {
	var body = req.body,
		id   = body.id,
		select = ['title', 'imageUrl', 'url', 'startTime', 'endTime', 'custemItems', 'active']
	ImgRP.getImgRPById(id, (item) => {
		if (!item) return Tools.errHandle('0128', res)
		var key = 'imgrp_' + Tools.hmac(item.key)
		ImgRP.updateImgRP(id, { active: 0 })
		Cache.del({ key: key, db: 2, cb: (e, o) => {
			if (e) return Tools.errHandle('0142', res)
			req.body = item
			Tools.errHandle('0000', res)
		}})
	})
})


// 获取推荐位列表
router.get('/getImgRPList', (req, res, next) => {
	var query  = req.query,
		select = ['key', 'name', 'description', 'id', 'createdAt', 'updatedAt', 'active', 'hash']

	ImgRP.getImgRPList(query, select, function (items, pageInfo) {

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
		userId = req.signedCookies.id

	ImgRP.getImgRPCByQuery({
		id: id
	}, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		Tools.errHandle('0000', res, item)
	})
})
router.post('/addImgRPC', (req, res, next) => {
	var body   = req.body,
		userId = req.signedCookies.id,
		rpId   = body.rpId

	if (!rpId) return Tools.errHandle('0126', res)

	ImgRP.getImgRPById(rpId, function(item) {
		if (!item) return Tools.errHandle('0128', res)
		body.userId = userId
		ImgRP.addImgRPC(body, function (item) {
			if (!item) return Tools.errHandle('0123', res)
			Tools.errHandle('0000', res)
		})
	})
})
router.post('/updateImgRPC', (req, res, next) => {
	var body  = req.body,
		rpId  = body.rpId,
		id    = body.id

	var bodyFilter = Tools.bodyFilter(rpcEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'imgrpc', body, function() {
		ImgRP.getImgRPCByQuery({
			rpId: rpId,
			id: id
		}, function(item) {
			if (!item) return Tools.errHandle('0128', res)
			ImgRP.updateImgRPC(id, body, function (err) {
				if (err) return Tools.errHandle('0130', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/removeImgRPC', (req, res, next) => {
	var body = req.body

	ImgRP.getImgRPCByQuery(body, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		ImgRP.removeImgRPC(body.id, function (err) {
			if (err) return Tools.errHandle('0133', res)
			req.body = item
			Tools.errHandle('0000', res)
		})
	})
})
router.post('/copyImgRPC', (req, res, next) => {
	var body = req.body

	ImgRP.getImgRPCByQuery(body, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		item = item.dataValues
		var nd = Date.now(),
			da = {
			key:         `imgrpc_${nd}`,
			rpId:        item.rpId,
			userId:      item.userId,
			imageUrl:    item.imageUrl,
			title:       `${item.title}_copy_${nd}`,
			url:         item.url,
			startTime:   item.startTime,
			endTime:     item.endTime,
			custemItems: item.custemItems,
		}
		ImgRP.addImgRPC(da, function (item) {
			if (!item) return Tools.errHandle('0123', res)
			req.body = da
			Tools.errHandle('0000', res)
		})
	})
})


// 获取推荐位内容列表
router.get('/getImgRPCList', (req, res, next) => {
	var q      = req.query,
		id     = q.$rpId,
		select = ['rpId', 'title', 'imageUrl', 'createdAt', 'updatedAt']
	if (!id) return Tools.errHandle('0128', res)
	ImgRP.getImgRPCList(q, select, function (items, pageInfo) {
		Tools.errHandle('0000', res, {
			list: items,
			pageInfo: pageInfo
		})
	})
})

router.get('/getImgRPC', (req, res, next) => {
	var q  = req.query
	var select = ['id', 'title', 'imageUrl']
	ImgRP.getImgRPCByRpId(q.id, select, (items) => {
		Tools.errHandle('0000', res, items)
	})
})

router.post('/sortImgRPC', (req, res, next) => {
	var body = req.body,
		id   = body.id
	ImgRP.getImgRPById(id, function(item) {
		if (!item) return Tools.errHandle('0128', res)
		ImgRP.sortImgRPCByRpId(body, (items) => {
			req.body = item
			Tools.errHandle('0000', res, items)
		})
	})
})

module.exports = router