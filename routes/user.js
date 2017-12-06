const express = require('express')
const router  = express.Router()
const config  = require('../config')
const crypto  = require('crypto')
const Cache   = require('../models/cache')
const Code    = require('../common/code')
const proxy   = require('../proxy')
const User    = proxy.User

router.get('/', (req, res, next) => {
	res.render('user', {
		title: '用户管理'
	})
})

router.get('/profile', (req, res, next) => {
	res.render('user/profile', {
		title: '个人信息',
		avatarEdit: 1
	})
})


module.exports = router
