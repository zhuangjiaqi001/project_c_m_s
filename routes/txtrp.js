const router  = require('express').Router()
const proxy   = require('../proxy')
const Tools   = require('../common/tools')
const TxtRP   = proxy.TxtRP

// 文字推荐位
const active  = 'txtrp'

// 列表
router.get('/', (req, res, next) => {
	res.render('txtrp', {
		active: active,
		title: '文字推荐位'
	})
})

// 创建
router.get('/add', (req, res, next) => {
	res.render('txtrp/add', {
		active: active,
		title: '新建文字推荐位'
	})
})
// 编辑
router.get('/edit/:id', (req, res, next) => {
	var id = req.params.id
	TxtRP.getTxtRPById(id, function(o) {
		if (!o) return Tools.permit('对不起！该推荐位不存在！', res)
		res.render('txtrp/add', {
			active: active,
			title: '编辑文字推荐位',
			rpInfo: o
		})
	})
})

// 推荐位内容列表
router.get('/:id', (req, res, next) => {
	var id = req.params.id

	TxtRP.getTxtRPById(id, function(o) {
		if (!o) return Tools.permit('对不起！该推荐位不存在！', res)
		res.render('txtrp/list', {
			active: active,
			id: id,
			item: o,
			title: '文字推荐位列表'
		})
	})
})

// 推荐位内容创建
router.get('/:id/add', (req, res, next) => {
	var id = req.params.id

	TxtRP.getTxtRPById(id, function(o) {
		if (!o) return Tools.permit('对不起！该推荐位不存在！', res)
		res.render('txtrp/itemAdd', {
			active: active,
			item: o,
			title: '新建内容'
		})
	})
})
// 推荐位内容编辑
router.get('/:rpId/edit/:id', (req, res, next) => {
	var params = req.params,
		rpId   = params.rpId,
		id     = params.id
	TxtRP.getTxtRPById(rpId, function(o) {
		if (!o) return Tools.permit('对不起！该推荐位不存在！', res)
		TxtRP.getTxtRPCByQuery({
			rpId: rpId,
			id: id
		}, function(o2) {
			if (!o2) return Tools.permit('对不起！该推荐位不存在！', res)
			res.render('txtrp/itemAdd', {
				active: active,
				title: '编辑内容',
				item: o,
				rpcInfo: o2
			})
		})
	})
})


module.exports = router
