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

// function modelFn(arr) {
// 	model.map(function(i, _) {
// 		var obj = {
// 			model: i,
// 			required: false,
// 			as: i.toLocaleLowerCase()
// 		}
// 		if (modelAttr[_]) obj.attributes = modelAttr[_]
// 		console.log(obj)
// 		arr.push(obj)
// 	})
// 	return arr
// }


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
		// var json = item.toJSON(),
		// 	type = json.type,
		// 	uc   = type.replace(/[a-z]/, i => i.toLocaleUpperCase()),
		// 	l    = 0
		
		// if (item[`${type}Id`]) {
		// 	++l
		// 	item[`get${uc}`]().then(item => {
		// 		json[type] = item.toJSON()
		// 		debugger
		// 	})
		// }
		// if (item[`${type}cId`]) {
		// 	++l
		// 	item[`get${uc}c`]().then(item => {
		// 		json[type+'c'] = item.toJSON()
		// 		debugger
		// 	})
		// }
		Tools.errHandle('0000', res, item)
	})
})
// attributes: ['createdAt'],

module.exports = router