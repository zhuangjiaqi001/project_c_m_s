const router  = require('express').Router()
const proxy   = require('../proxy')
const Tools   = require('../common/tools')
const Temp   = proxy.Temp

// 模板类
const active  = 'temp'

// 列表
router.get('/', (req, res, next) => {
	res.render('temp', {
		active: active,
		title: '模板类'
	})
})

// 创建
router.get('/add', (req, res, next) => {
	res.render('temp/add', {
		active: active,
		title: '新建模板类'
	})
})
// 编辑
router.get('/edit/:id', (req, res, next) => {
	var id = req.params.id
	Temp.getTempById(id, function(o) {
		if (!o) return Tools.permit('对不起！该模板类不存在！', res)
		o.custemItems = JSON.stringify(o.custemItems)
		res.render('temp/add', {
			active: active,
			title: '编辑模板类',
			tempInfo: o
		})
	})
})

// 模板类内容列表
router.get('/:id', (req, res, next) => {
	var id = req.params.id

	Temp.getTempById(id, function(o) {
		if (!o) return Tools.permit('对不起！该模板类不存在！', res)
		res.render('temp/list', {
			active: active,
			id: id,
			item: o,
			title: '模板类列表'
		})
	})
})

// 模板类内容创建
router.get('/:id/add', (req, res, next) => {
	var id = req.params.id

	Temp.getTempById(id, function(o) {
		if (!o) return Tools.permit('对不起！该模板类不存在！', res)
		res.render('temp/itemAdd', {
			active: active,
			item: o,
			title: '新建内容'
		})
	})
})
// 模板类内容编辑
router.get('/:tempId/edit/:id', (req, res, next) => {
	var params = req.params,
		tempId   = params.tempId,
		id     = params.id
	Temp.getTempById(tempId, function(o) {
		if (!o) return Tools.permit('对不起！该模板类不存在！', res)
		Temp.getTempCByQuery({
			tempId: tempId,
			id: id
		}, function(o2) {
			if (!o2) return Tools.permit('对不起！该模板类不存在！', res)
			o2.custemItems = JSON.stringify(o2.custemItems)
			res.render('temp/itemAdd', {
				active: active,
				title: '编辑内容',
				item: o,
				tempcInfo: o2
			})
		})
	})
})


module.exports = router
