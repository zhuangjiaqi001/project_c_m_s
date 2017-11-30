const router  = require('express').Router()
const config  = require('../config')
const Tools   = require('../common/tools')
const proxy   = require('../proxy')
const Valid   = require('../common/valid')

const User    = proxy.User

const formidable = require('formidable')

// 用户注册
router.post('/', (req, res, next) => {
	var body      = req.body,
		loginname = body.loginname,
		password  = body.password,
		passwordR = body.passwordR,
		email     = body.email

	Valid.run(res, 'reg', body, function() {
		// 检查用户名是否已经存在
		User.getUserByQuery({
			'loginname': loginname,
			'email': email
		}, function(user) {
			var url = config.link.index
			if (user) return Tools.errFlash(req, res, 'indexErr', '0026', url)
			User.addUser(loginname, password, email, function (err) {
				if (err) return Tools.errFlash(req, res, 'indexErr', '0027', url)
				res.redirect(config.link.index)
			})
		})
	}, function(code) {
		return Tools.errFlash(req, res, 'indexErr', code, url)
	})

})

module.exports = router
