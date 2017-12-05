const models  = require('../models')
const User    = models.User
const uuid    = require('node-uuid')
const Tools   = require('../common/tools')
const Valid   = require('../common/valid')
const config  = require('../config')

/**
 * 根据用户名列表查找用户列表
 * Callback:
 * - err, 数据库异常
 * - items, 用户列表
 * - pageInfo, 列表分页信息
 * @param {Object} query 请求参数
 * @param {Array} select 字段名称列表
 * @param {Function} cb 回调函数
 */
exports.getUserList = function(query, select, cb) {
	var qs = Tools.querySearch(query, select)
	User.findAndCountAll(qs.opts).then(function(items) {
		cb(Tools.dataToJSON(items.rows), {
			total: items.count,
			current: qs.page,
			pageSize: qs.opts.limit
		})
	})
}

/**
 * 根据登录名密码查找用户
 * Callback:
 * - err, 数据库异常
 * - item, 用户
 * @param {String} loginname 登录名
 * @param {String} password  密码
 * @param {Function} cb 回调函数
 */
exports.getUserByLogin = function (loginname, password, cb) {
	var isE = Valid.RE.email.test(loginname),
		isP = Valid.RE.phone.test(loginname),
		isL = Valid.RE.email.test(loginname),
		query = { 'password': Tools.hmac(password) }
	if (isE) query.email          = loginname
	else if (isP) query.mobile    = loginname
	else query.loginname = loginname
	return User.findOne({ where: query }).then(function(item) {
		cb(item? Tools.dataToJSON(item): null)
	})
}

/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - item, 用户
 * @param {String} loginname 登录名
 * @param {Function} cb 回调函数
 */
exports.getUserById = function (id, select, cb) {
	var opts = { where: { id: id } }
	if (select.length) opts.attributes = select
	return User.findOne(opts).then(function(item) {
		cb(item? Tools.dataToJSON(item): null)
	})
}

/**
 * 根据关键字，查找用户
 * Callback:
 * - item, 用户
 * @param {String}   query 邮箱
 * @param {Function} cb    回调函数
 */
exports.getUserByQuery = function (query, cb) {
	return User.findOne({ where: query }).then(function(item) {
		cb(item? Tools.dataToJSON(item): null)
	})
}

exports.addUser = function (loginname, password, email, cb) {
	var item = {
		loginname:   loginname,
		password:    Tools.hmac(password),
		email:       email,
		avatar:      createAvatar(),
		accessToken: uuid.v4()
	}
	return User.create(item).then(item => {
		cb(!item, item.dataValues)
	})
}

exports.updateUser = function(id, opts, cb) {
	return User.update(opts, { where: { id: id } }).then(item => {
		cb(!item, item[0])
	})
}

var createAvatar = function () {
	return '/img/avatar/' + Math.ceil(Math.random()*5) + '.png'
}
exports.createAvatar = createAvatar

exports.isNotLogin = function(req, res, next) {
	var token     = req.signedCookies.token
	var loginname = req.signedCookies.loginname
	if (token && loginname) {
		return res.redirect(config.link.index)
	} else {
		next()
	}
}

exports.getAvatar = function (item) {
	return item.avatar || createAvatar(item)
}