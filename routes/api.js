const router  = require('express').Router()
const Tools   = require('../common/tools')

router.all('*', (req, res, next) => {
	var url = req.originalUrl
	if (/zjq_reg/.test(url)) return next()
	var token     = req.signedCookies.token,
		userId    = req.signedCookies.id,
		loginname = req.signedCookies.loginname
	if (token && userId && loginname) {
		req.userId = userId
		req.loginname = loginname
		next()
	} else {
		return Tools.errHandle('0006', res)
	}
})

router.use('/user',  require('./api/user'))
router.use('/file',  require('./api/file'))
router.use('/imgrp', require('./api/imgrp'))
router.use('/txtrp', require('./api/txtrp'))
router.use('/img',   require('./api/img'))
router.use('/temp',  require('./api/temp'))
router.use('/shop',  require('./api/shop'))
router.use('/page',  require('./api/page'))
router.use('/store', require('./api/store'))
router.use('/log',   require('./api/log'))

module.exports = router
