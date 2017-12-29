const router  = require('express').Router()
const proxy   = require('../../proxy')

const Tools   = require('../../common/tools')
const Log     = proxy.Log

// 获取推荐位列表
router.get('/getLogList', (req, res, next) => {
	var query  = req.query,
		select = ['id', 'loginname', 'type', 'directive', 'desc', 'createdAt']

	Log.getLogList(query, select, function (items, pageInfo) {

		Tools.errHandle('0000', res, {
			list: items,
			pageInfo: pageInfo
		})
	})
})

// 获取推荐位内容列表
router.get('/getLog', (req, res, next) => {
	var q = req.query
	Log.getLogById(q.id, function (item) {
		Tools.errHandle('0000', res, item)
	})
})

module.exports = router