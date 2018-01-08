const router  = require('express').Router()
const config  = require('../config')
const Cache   = require('../models/cache')

router.get('/', (req, res, next) => {
	res.clearCookie('token')
	res.clearCookie('aToken')
	res.clearCookie('loginname')
	res.clearCookie('id')
	res.clearCookie('rem')
	res.redirect(config.link.login)
})

module.exports = router
