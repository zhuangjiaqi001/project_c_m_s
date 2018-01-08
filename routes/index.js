const router  = require('express').Router()
const config  = require('../config')
const Cache   = require('../models/cache')
const Tools   = require('../common/tools')
const proxy   = require('../proxy')
const Valid   = require('../common/valid')
const User    = proxy.User

router.get('/', User.isNotLogin)
router.get('/', (req, res, next) => {
	res.render('index', {
		message: req.flash('indexErr')
	})
})

router.post('/', (req, res, next) => {
	var body      = req.body,
		loginname = body.loginname,
		password  = body.password,
		remember  = body.remember

	var url = config.link.index
	Valid.run(res, 'login', body, function() {
		User.getUserByLogin(loginname, password, function(user) {
			if (!user) return Tools.errFlash(req, res, 'indexErr', '0003', url)
			var token  = 'user_' + Tools.hmac(user.accessToken + new Date()*1),
				aToken = 'user_' + user.accessToken
			user.dataValues.token = token
			Cache.save({
				key: aToken,
				data: user,
				expired: remember? config.cookieRemExpiredTime: config.cacheExpiredTime,
				cb: function(e, o) {
					if (e) {
						return Tools.errFlash(req, res, 'indexErr', '0005', url)
					}
					req.session.user = user
					var cookieCtrl = remember? config.cookieRemCtrl: config.cookieCtrl
					res.cookie('token',  token,  cookieCtrl)
					res.cookie('aToken', aToken, cookieCtrl)
					res.cookie('loginname', user.loginname, cookieCtrl)
					res.cookie('id', user.id, cookieCtrl)
					res.cookie('rem', remember, cookieCtrl)
					res.redirect(url)
				}
			})
		})	
	}, function(code) {
		return Tools.errFlash(req, res, 'indexErr', code, url)
	})
})


module.exports = router
