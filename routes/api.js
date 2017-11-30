const router  = require('express').Router()
const Tools   = require('../common/tools')

router.all('*', (req, res, next) => {
	var token     = req.signedCookies.token,
		id        = req.signedCookies.id,
		loginname = req.signedCookies.loginname
	if (token && id && loginname) {
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

module.exports = router
