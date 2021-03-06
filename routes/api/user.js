const express = require('express')
const router  = express.Router()
const config  = require('../../config')
const MJJS    = require('../../common/MJJS')
const models  = require('../../models')
const Cache   = require('../../models/cache')
const proxy   = require('../../proxy')
const User    = proxy.User
const Mapping = require('../../common/mapping')
const Tools   = require('../../common/tools')
const Valid   = require('../../common/valid')
const userEdit = require('../../common/edit').User

function updateRedis(req, res, id, token, aToken, remember) {
	User.getUserById(id, [], function (user) {
		user.dataValues.token = token
		Cache.save({
			key: aToken,
			data: user,
			expired: remember? config.cookieRemExpiredTime: config.cacheExpiredTime,
			cb: function(e, o) {
				if (e) return Tools.errHandle('0044', res)
				req.session.user = user
				var cookieCtrl = remember? config.cookieRemCtrl: config.cookieCtrl
				res.cookie('token',  token, cookieCtrl)
				res.cookie('aToken', aToken, cookieCtrl)
				res.cookie('loginname', user.loginname, cookieCtrl)
				res.cookie('id', user.id, cookieCtrl)
				res.cookie('rem', remember, cookieCtrl)
				req.body = user
				Tools.errHandle('0000', res)
			}
		})
	})
}


// 获取用户信息
router.get('/getUserInfo', (req, res, next) => {
	var token  = req.signedCookies.token,
		aToken = req.signedCookies.aToken
	Cache.get({
		key: aToken,
		cb: function(e, user) {
			if (e) return Tools.errHandle('0006', res)
			if (user.token != token) return Tools.errHandle('0007', res)
			var select = ['loginname', 'nickname', 'email', 'gender', 'birthday', 'zodiac', 'zodiac_china', 'blood_type', 'avatar', 'levelName', 'createdAt']
			user = Tools.dataFilter(user, select)
			user.genderName = Mapping.gender[user.gender] || Mapping.gender[0]
			user.createdAt  = Tools.formatDate(user.createdAt)
			Tools.errHandle('0000', res, user)
		}
	})
})

// 获取用户列表
router.get('/list', (req, res, next) => {
	var query  = req.query
	var select = ['loginname', 'email', 'level', 'levelName', 'createdAt', 'avatar']

	User.getUserList(query, select, function (items, pageInfo) {
		Tools.errHandle('0000', res, {
			list: items,
			pageInfo: pageInfo
		})
	})
})

// 修改用户信息
router.post('/update', (req, res, next) => {
	var body  = req.body,
		mid   = req.signedCookies.id*1,
		nid   = body.id,
		token  = req.signedCookies.token,
		aToken = req.signedCookies.aToken,
		birdate  = body.birthday,
		remember = req.signedCookies.rem

	var bodyFilter = Tools.bodyFilter(userEdit, body)
	body = bodyFilter.obj

	// 根据生日计算星座&生肖
	if (birdate) {
		body.zodiac = Tools.getAstro(birdate)
		body.zodiac_china = Tools.getZodiacChina(birdate)
	}

	if (!bodyFilter.length) return Tools.errHandle('0041', res)

	if (nid && mid != nid) {
		User.getUsersByIds([mid, nid], function (err, items) {
			if (err) return Tools.errHandle('0010', res)
			var muser  = getUserById(mid, items),
				nuser  = getUserById(nid, items),
				mlevel = muser.level,
				nlevel = nuser.level

			if (mlevel <= nlevel) return Tools.errHandle('0043', res)

			User.updateUser(nid, body, function (err, user) {
				if (err) return Tools.errHandle('0042', res)
				updateRedis(req, res, nid, token, aToken, remember)
			})
		})
	} else {
		User.updateUser(mid, body, function (err, user) {
			if (err) return Tools.errHandle('0041', res)
			updateRedis(req, res, mid, token, aToken, remember)
		})
	}
})

// 获取用户资源信息
router.get('/getRes', (req, res, next) => {
	var id  = req.signedCookies.id
	User.findById(id, {
		include: [{
			all: true,
			required: false,
			attributes: ['id'],
		}],
		attributes: [],
	}, function (user) {
		if (!user) return Tools.errHandle('0011', res)
		for (var p in user.dataValues) {
			user.dataValues[p] = user.dataValues[p].length
		}
		Tools.errHandle('0000', res, user.dataValues)
	})
})


// 用户注册
router.post('/zjq_reg', (req, res, next) => {
	var body      = req.body,
		loginname = body.loginname,
		password  = body.password,
		email     = body.email

	body.passwordR = password
	// if (admin != config.admin) return Tools.errHandle('0028', res)

	Valid.run(res, 'reg', body, function() {
		// 检查用户名是否已经存在
		User.getUserByQuery({
			'loginname': loginname,
			'email': email
		}, function(user) {
			if (user) return Tools.errHandle('0026', res)
			User.addUser(loginname, password, email, function (err) {
				if (err) return Tools.errHandle('0027', res)
				return Tools.errHandle('0000', res)
			})
		})
	}, function(code) {
		return Tools.errHandle(code, res)
	})
})

function getUserById(id, items) {
	var o = ''
	items.map((_) => {
		if (id === _.id) o = _
	})
	return o
}


module.exports = router