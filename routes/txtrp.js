const router  = require('express').Router()
const proxy   = require('../proxy')
const Tools   = require('../common/tools')
const TxtRP   = proxy.TxtRP

// 列表
router.get('/', (req, res, next) => {
	res.render('txtrp', {
		title: '文字推荐位'
	})
})

// 创建
router.get('/add', (req, res, next) => {
	res.render('txtrp/add', {
		title: '新建文字推荐位'
	})
})

// 编辑
router.get('/edit', (req, res, next) => {
	res.render('txtrp/add', {
		title: '编辑文字推荐位'
	})
})

// 推荐位内容列表
router.get('/list', (req, res, next) => {
	res.render('txtrp/list', {
		title: '文字推荐位列表'
	})
})

// 推荐位内容创建
router.get('/itemAdd', (req, res, next) => {
	res.render('txtrp/itemAdd', {
		title: '新建内容'
	})
})

// 推荐位内容编辑
router.get('/itemEdit', (req, res, next) => {
	res.render('txtrp/itemAdd', {
		title: '编辑内容'
	})
})


module.exports = router
