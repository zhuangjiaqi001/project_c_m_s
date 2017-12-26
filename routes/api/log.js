const router  = require('express').Router()
const proxy   = require('../../proxy')
const models  = require('../../models')
const User    = models.User
const Img     = models.Img
const ImgRP   = models.ImgRP
const ImgRPC  = models.ImgRPC
const TxtRP   = models.TxtRP
const TxtRPC  = models.TxtRPC
const Temp    = models.Temp
const TempC   = models.TempC
const Page    = models.Page
const PageC   = models.PageC
const Shop    = models.Shop
const ShopC   = models.ShopC
const Store   = models.Store
const StoreC  = models.StoreC

const model   = ['User','Img']
const modelAttr = [
	['loginname']
]

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
	Log.getLogById(q.id, {
		include: [{
			all: true,
			required: false,
			attributes: ['id'],
		}],
	}, function (item) {
		Tools.errHandle('0000', res, item)
	})
})
// attributes: ['createdAt'],

module.exports = router