const router  = require('express').Router()

router.all('*', function(err, req, res, next) {
	res.status(500).render('ERROR500', {
		title: '500'
	})
})

module.exports = router
