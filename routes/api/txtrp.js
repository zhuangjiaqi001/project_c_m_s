const router  = require('express').Router()
const Cache   = require('../../models/cache')
const proxy   = require('../../proxy')
const TxtRP   = proxy.TxtRP
const Tools   = require('../../common/tools')
const Valid   = require('../../common/valid')
const Edit    = require('../../common/edit')
const rpEdit  = Edit.TxtRP
const rpcEdit = Edit.TxtRPC

// 创建推荐位
router.get('/get', (req, res, next) => {
	var q      = req.query,
		id     = q.id,
		userId = req.signedCookies.id

	TxtRP.getTxtRPById(id, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		Tools.errHandle('0000', res, item)
	})
})
router.post('/addTxtRP', (req, res, next) => {
	var id   = req.signedCookies.id*1,
		body = req.body,
		key  = body.key,
		name = body.name,
		description = body.description,
		custemItems = body.custemItems || []

	Valid.run(res, 'txtrp', body, function() {
		TxtRP.getTxtRPByQuery({
			'key':  key,
			'name': name
		}, function (item) {
			if (item) return Tools.errHandle('0123', res)

			TxtRP.addTxtRP(key, name, description, custemItems, id, function (err) {
				if (err) return Tools.errHandle('0124', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/updateTxtRP', (req, res, next) => {
	var body = req.body,
		id   = body.id*1

	if (!body.custemItems) body.custemItems = []
	var bodyFilter = Tools.bodyFilter(rpEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'txtrpUp', body, function() {
		TxtRP.getTxtRPById(id, function (item) {
			if (!item) return Tools.errHandle('0128', res)
			TxtRP.updateTxtRP(id, body, function (err) {
				if (err) return Tools.errHandle('0130', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/removeTxtRP', (req, res, next) => {
	var body = req.body,
		id   = body.id

	TxtRP.getTxtRPById(id, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		if (item.active)  return Tools.errHandle('0134', res)
		TxtRP.removeTxtRP(id, function (err) {
			if (err) return Tools.errHandle('0130', res)
			req.body = item
			Tools.errHandle('0000', res)
		})
	})
})
router.post('/releaseTxtRP', (req, res, next) => {
	var body = req.body,
		id   = body.id,
		select = ['title', 'url', 'startTime', 'endTime', 'custemItems']
	TxtRP.getTxtRPById(id, (item) => {
		if (!item) return Tools.errHandle('0128', res)
		var key = 'txtrp_' + Tools.hmac(item.key)
		TxtRP.updateTxtRP(id, { active: 1 })
		TxtRP.getTxtRPCByRpId(id, select, (items, count) => {
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
router.post('/offlineTxtRP', (req, res, next) => {
	var body = req.body,
		id   = body.id,
		select = ['title', 'url', 'startTime', 'endTime', 'custemItems', 'active']
	TxtRP.getTxtRPById(id, (item) => {
		if (!item) return Tools.errHandle('0128', res)
		var key = 'txtrp_' + Tools.hmac(item.key)
		TxtRP.updateTxtRP(id, { active: 0 })
		Cache.del({ key: key, db: 2, cb: (e, o) => {
			if (e) return Tools.errHandle('0142', res)
			req.body = item
			Tools.errHandle('0000', res)
		}})
	})
})


// 获取推荐位列表
router.get('/getTxtRPList', (req, res, next) => {
	var query  = req.query,
		select = ['key', 'name', 'description', 'id', 'createdAt', 'updatedAt', 'active', 'hash']

	TxtRP.getTxtRPList(query, select, function (items, pageInfo) {

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

	TxtRP.getTxtRPCByQuery({
		id: id
	}, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		Tools.errHandle('0000', res, item)
	})
})
router.post('/addTxtRPC', (req, res, next) => {
	var body   = req.body,
		userId = req.signedCookies.id,
		rpId   = body.rpId

	if (!rpId) return Tools.errHandle('0126', res)

	TxtRP.getTxtRPById(rpId, function(item) {
		if (!item) return Tools.errHandle('0128', res)
		body.userId = userId
		TxtRP.addTxtRPC(body, function (item) {
			if (!item) return Tools.errHandle('0123', res)
			Tools.errHandle('0000', res)
		})
	})
})
router.post('/updateTxtRPC', (req, res, next) => {
	var body  = req.body,
		rpId  = body.rpId,
		id    = body.id

	var bodyFilter = Tools.bodyFilter(rpcEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'txtrpc', body, function() {
		TxtRP.getTxtRPCByQuery({
			rpId: rpId,
			id: id
		}, function(item) {
			if (!item) return Tools.errHandle('0128', res)
			TxtRP.updateTxtRPC(id, body, function (err) {
				if (err) return Tools.errHandle('0130', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/removeTxtRPC', (req, res, next) => {
	var body = req.body

	TxtRP.getTxtRPCByQuery(body, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		TxtRP.removeTxtRPC(body.id, function (err) {
			if (err) return Tools.errHandle('0133', res)
			req.body = item
			Tools.errHandle('0000', res)
		})
	})
})
router.post('/copyTxtRPC', (req, res, next) => {
	var body = req.body

	TxtRP.getTxtRPCByQuery(body, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		item = item.dataValues
		var da = {
			key:         item.key,
			rpId:        item.rpId,
			userId:      item.userId,
			title:       `${item.title}_copy`,
			url:         item.url,
			startTime:   item.startTime,
			endTime:     item.endTime,
			custemItems: item.custemItems,
		}
		req.body = da
		TxtRP.addTxtRPC(da, function (item) {
			if (!item) return Tools.errHandle('0123', res)
			Tools.errHandle('0000', res)
		})
	})
})


// 获取推荐位内容列表
router.get('/getTxtRPCList', (req, res, next) => {
	var query  = req.query
	var select = ['rpId', 'title', 'createdAt', 'updatedAt']
	TxtRP.getTxtRPCList(query, select, function (items, pageInfo) {
		Tools.errHandle('0000', res, {
			list: items,
			pageInfo: pageInfo
		})
	})
})

router.get('/getTxtRPC', (req, res, next) => {
	var q  = req.query
	var select = ['id', 'title']
	TxtRP.getTxtRPCByRpId(q.id, select, (items) => {
		Tools.errHandle('0000', res, items)
	})
})

router.post('/sortTxtRPC', (req, res, next) => {
	var body = req.body,
		id   = body.id
	TxtRP.getTxtRPById(id, function(item) {
		if (!item) return Tools.errHandle('0128', res)
		TxtRP.sortTxtRPCByRpId(body, (items) => {
			req.body = item
			Tools.errHandle('0000', res, items)
		})
	})
})

module.exports = router