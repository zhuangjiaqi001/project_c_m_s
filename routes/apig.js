const router  = require('express').Router()
const Tools   = require('../common/tools')

// router.all('*', (req, res, next) => {
// 	var token     = req.signedCookies.token,
// 		id        = req.signedCookies.id,
// 		loginname = req.signedCookies.loginname
// 	if (token && id && loginname) {
// 		next()
// 	} else {
// 		return Tools.errHandle('0006', res)
// 	}
// })

router.use('/rp',   require('./apig/rp'))


module.exports = router
