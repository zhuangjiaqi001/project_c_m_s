const express = require('express')
const router  = express.Router()
const config  = require('../config')
const crypto  = require('crypto')
const Cache   = require('../models/cache')
const Code    = require('../common/code')
const proxy   = require('../proxy')
const User    = proxy.User

// router.get('/', (req, res, next) => {
// 	res.render('user')
// })

router.get('/profile', (req, res, next) => {
	res.render('user/profile', {
		avatarEdit: 1
	})
})


module.exports = router
