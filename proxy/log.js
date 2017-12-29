const models = require('../models')
const Log    = models.Log
const Tools  = require('../common/tools')


/**
 * 根据条件字段查找推荐位列表
 * Callback:
 * - err, 数据库异常
 * - items, 推荐位列表
 * - pageInfo, 列表分页信息
 * @param {Object}   query 请求参数
 * @param {Array}    select 筛选返回的字段名称列表
 * @param {Function} cb 回调函数
 */
exports.getLogList = function(query, select, cb) {
	var qs = Tools.querySearch(query, select)
	Log.findAndCountAll(qs.opts).then(function(items) {
		cb(items.rows, {
			total: items.count,
			current: qs.page,
			pageSize: qs.opts.limit
		})
	})
}

/**
 * 根据内容创建推荐位
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String}   key 推荐位KEY
 * @param {String}   name 推荐位名称
 * @param {String}   description 推荐位备注
 * @param {Array}    custemItems 自定义字段
 * @param {String}   id 创建者
 * @param {Function} cb 回调函数
 */
exports.addLog = function(opts, cb) {
	return Log.create(opts).then(rp => {
		cb && cb(!rp, rp.dataValues)
	})
}
exports.removeLog = function (id, cb) {
	Log.destroy({ where: { id: id } }).then(rp => {
		cb(!rp, rp[0])
	})
}
/**
 * 根据用户ID，查找推荐位
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} cb 回调函数
 */
exports.getLogById = function (id, cb) {
	Log.findById(id).then(item => {
		cb(item? item: null)
	})
}
