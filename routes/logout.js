const router  = require('express').Router()
const config  = require('../config')

router.get('/', (req, res, next) => {
	res.clearCookie('token')
	res.clearCookie('loginname')
	res.clearCookie('id')
	res.redirect(config.link.index)
})

module.exports = router
