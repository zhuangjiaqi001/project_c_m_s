const router  = require('express').Router()
const proxy   = require('../proxy')
const Tools   = require('../common/tools')
const ImgRP   = proxy.ImgRP

// 列表
router.get('/', (req, res, next) => {
	res.render('imgrp')
})

// 创建
router.get('/add', (req, res, next) => {
	res.render('imgrp/add')
})

// 编辑
router.get('/edit', (req, res, next) => {
	res.render('imgrp/add')
})

// 推荐位内容列表
router.get('/list', (req, res, next) => {
	res.render('imgrp/list')
})

// 推荐位内容创建
router.get('/itemAdd', (req, res, next) => {
	res.render('imgrp/itemAdd')
})

// 推荐位内容编辑
router.get('/itemEdit', (req, res, next) => {
	res.render('imgrp/itemAdd')
})


module.exports = router
