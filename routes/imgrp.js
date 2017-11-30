const router  = require('express').Router()
const proxy   = require('../proxy')
const Tools   = require('../common/tools')
const ImgRP   = proxy.ImgRP

// 图片推荐位
const active  = 'imgrp'

// 列表
router.get('/', (req, res, next) => {
	res.render('imgrp', {
		active: active,
		title: '图片推荐位'
	})
})

// 创建
router.get('/add', (req, res, next) => {
	res.render('imgrp/add', {
		active: active,
		title: '新建图片推荐位'
	})
})
// 编辑
router.get('/edit/:id', (req, res, next) => {
	var id = req.params.id
	ImgRP.getImgRPById(id, function(o) {
		if (!o) return Tools.permit('对不起！该推荐位不存在！', res)
		res.render('imgrp/add', {
			active: active,
			title: '编辑图片推荐位',
			rpInfo: o
		})
	})
})

// 推荐位内容列表
router.get('/:id', (req, res, next) => {
	var id = req.params.id

	ImgRP.getImgRPById(id, function(o) {
		if (!o) return Tools.permit('对不起！该推荐位不存在！', res)
		res.render('imgrp/list', {
			active: active,
			id: id,
			item: o,
			title: '图片推荐位列表'
		})
	})
})

// 推荐位内容创建
router.get('/:id/add', (req, res, next) => {
	var id = req.params.id

	ImgRP.getImgRPById(id, function(o) {
		if (!o) return Tools.permit('对不起！该推荐位不存在！', res)
		res.render('imgrp/itemAdd', {
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
	ImgRP.getImgRPById(rpId, function(o) {
		if (!o) return Tools.permit('对不起！该推荐位不存在！', res)
		ImgRP.getImgRPCByQuery({
			rpId: rpId,
			id: id
		}, function(o2) {
			if (!o2) return Tools.permit('对不起！该推荐位不存在！', res)
			res.render('imgrp/itemAdd', {
				active: active,
				title: '编辑内容',
				item: o,
				rpcInfo: o2
			})
		})
	})
})


module.exports = router
