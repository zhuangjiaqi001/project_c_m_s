const router  = require('express').Router()

router.get('/', (req, res, next) => {
	res.render('dashboard', {
		title: '总体数据'
	})
})

module.exports = router
