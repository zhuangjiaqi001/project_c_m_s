const router  = require('express').Router()

const active  = 'dashboard'
router.get('/', (req, res, next) => {
	res.render('dashboard', {
		active: active,
		title: '总体数据'
	})
})

module.exports = router
