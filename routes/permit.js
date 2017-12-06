const router  = require('express').Router()
const config  = require('../config')
const crypto  = require('crypto')
const Cache   = require('../models/cache')
const Code    = require('../common/code')
const proxy   = require('../proxy')
const User    = proxy.User

router.get('/', (req, res, next) => {
	res.render('permit', {
		title: '权限管理'
	})
})


module.exports = router
