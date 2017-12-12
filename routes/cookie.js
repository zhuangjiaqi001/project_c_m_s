const router  = require('express').Router()
const config  = require('../config')
const Cache   = require('../models/cache')

router.get('*', (req, res, next) => {
	var token     = req.signedCookies.token,
		aToken    = req.signedCookies.aToken,
		loginname = req.signedCookies.loginname
	if (token && aToken && loginname) {
		next()
	} else {
		return res.redirect(config.link.login)
	}
})

module.exports = router
