const router  = require('express').Router()
const proxy   = require('../proxy')
const Tools   = require('../common/tools')
const TxtRP   = proxy.TxtRP

// 列表
router.get('/', (req, res, next) => {
	res.render('txtrp')
})

// 创建
router.get('/add', (req, res, next) => {
	res.render('txtrp/add')
})

// 编辑
router.get('/edit', (req, res, next) => {
	res.render('txtrp/add')
})

// 推荐位内容列表
router.get('/list', (req, res, next) => {
	res.render('txtrp/list')
})

// 推荐位内容创建
router.get('/itemAdd', (req, res, next) => {
	res.render('txtrp/itemAdd')
})

// 推荐位内容编辑
router.get('/itemEdit', (req, res, next) => {
	res.render('txtrp/itemAdd')
})

// 推荐位内容排序
router.get('/itemSort', (req, res, next) => {
	res.render('txtrp/itemSort')
})


module.exports = router
