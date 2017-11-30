const router  = require('express').Router()
const config  = require('../config')
const crypto  = require('crypto')
const Cache   = require('../models/cache')
const Code    = require('../common/code')
const proxy   = require('../proxy')
const User    = proxy.User

const active  = 'page'
router.get('/', (req, res, next) => {
	res.render('page', {
		active: active,
		title: '落地页管理'
	})
})

module.exports = router
