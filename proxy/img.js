const models = require('../models')
const Img    = models.Img
const Tools  = require('../common/tools')


/**
 * 根据条件字段查找列表
 * Callback:
 * - items, 列表
 * - pageInfo, 列表分页信息
 * @param {Object}   query  请求参数
 * @param {Array}    select 筛选返回的字段名称列表
 * @param {Function} cb 回调函数
 */
exports.getImgList = function(query, select, cb) {
	var qs = Tools.querySearch(query, select)
	Img.findAndCountAll(qs.opts).then(function(items) {
		cb(items.rows, {
			total: items.count,
			current: qs.page,
			pageSize: qs.opts.limit
		})
	})
}



// 创建图片(推荐位)
exports.addImage = function (url, id, cb) {
	var img = {
		url: url,
		userId: id
	}
	return Img.create(img).then(img => {
		cb(!img, img.dataValues)
	})
}

// 创建图片(头像)
exports.addAvatar = function (url, id, cb) {
	var img = {
		url: url,
		userId: id,
		type: 0
	}
	return Img.create(img).then(img => {
		cb(!img, img.dataValues)
	})
}
// 创建图片(编辑器)
exports.addUE = function (url, id, cb) {
	var img = {
		url: url,
		userId: id,
		type: 2
	}
	return Img.create(img).then(img => {
		cb(!img, img.dataValues)
	})
}

var createAvatar = function () {
	return '/img/avatar/' + Math.ceil(Math.random()*5) + '.png'
}
exports.createAvatar = createAvatar

exports.getAvatar = function (user) {
	return user.avatar || createAvatar(user)
}