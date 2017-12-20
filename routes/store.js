const router  = require('express').Router()
const proxy   = require('../proxy')
const Tools   = require('../common/tools')

// 列表
router.get('/', (req, res, next) => {
	res.render('store')
})

// 创建
router.get('/add', (req, res, next) => {
	res.render('store/add')
})
// 编辑
router.get('/edit', (req, res, next) => {
	res.render('store/add')
})

// 模板类内容列表
router.get('/list', (req, res, next) => {
	res.render('store/list')
})

// 模板类内容创建
router.get('/itemAdd', (req, res, next) => {
	res.render('store/itemAdd')
})

// 模板类内容编辑
router.get('/itemEdit', (req, res, next) => {
	res.render('store/itemAdd')
})


module.exports = router
