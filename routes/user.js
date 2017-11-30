const express = require('express')
const router  = express.Router()
const config  = require('../config')
const crypto  = require('crypto')
const Cache   = require('../models/cache')
const Code    = require('../common/code')
const proxy   = require('../proxy')
const User    = proxy.User

const active  = 'user'
router.get('/', (req, res, next) => {
	res.render('user', {
		active: active,
		title: '用户管理'
	})
})

router.get('/profile', (req, res, next) => {
	res.render('user/profile', {
		active: active,
		title: '个人信息',
		avatarEdit: 1
	})
})


module.exports = router
