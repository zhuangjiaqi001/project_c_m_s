const models = require('../models')
const TxtRP  = models.TxtRP
const TxtRPC = models.TxtRPC
const User   = models.User
const uuid   = require('node-uuid')
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
exports.getTxtRPList = function(query, select, cb) {
	var qs = Tools.querySearch(query, select)
	TxtRP.findAndCountAll(qs.opts).then(function(users) {
		cb(users.rows, {
			total: users.count,
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
exports.addTxtRP = function (key, name, description, custemItems, id, cb) {
	var txtrp = {
		key: key,
		name: name,
		description: description,
		custemItems: JSON.stringify(custemItems),
		userId: id,
		hash: Tools.hmac(key)
	}
	return TxtRP.create(txtrp).then(rp => {
		cb(!rp, rp.dataValues)
	})
}
exports.updateTxtRP = function (id, opts, cb) {
	return TxtRP.update(opts, { where: { id: id } }).then(rp => {
		cb && cb(!rp, rp[0])
	})
}
exports.removeTxtRP = function (id, cb) {
	TxtRP.findById(id).then(item => {
		item.getTxtRPC().then(rpc => {
			console.log(rpc)
			var l = rpc.length
			if (l) {
				var ids = []
				for (var v of rpc) {
					ids.push(v.dataValues.id)
				}
				TxtRPC.destroy({ where: { id: { $or: ids } } }).then(rp => {
					TxtRP.destroy({ where: { id: id } }).then(rp => {
						cb(!rp, rp[0])
					})
				})
			} else {
				TxtRP.destroy({ where: { id: id } }).then(rp => {
					cb(!rp, rp[0])
				})
			}
		})
	})
}

/**
 * 根据关键字，查找推荐位
 * Callback:
 * - item, 推荐位列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} cb 回调函数
 */
exports.getTxtRPByQuery = function (query, cb) {
	return TxtRP.findOne({ where: query }).then(item => {
		cb(item? item.dataValues: null)
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
exports.getTxtRPById = function (id, cb) {
	TxtRP.findById(id).then(item => {
		cb(item? item.dataValues: null)
	})
}

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
exports.getTxtRPCList = function(query, select, cb) {
	var qs = Tools.querySearch(query, select)
	TxtRPC.findAndCountAll(qs.opts).then(function(users) {
		cb(users.rows, {
			total: users.count,
			current: qs.page,
			pageSize: qs.opts.limit
		})
	})
}
// 根据条件查找推荐位内容
exports.getTxtRPCByQuery = function (query, cb) {
	return TxtRPC.findOne({ where: query }).then(item => {
		cb(item? item.dataValues: null)
	})
}

exports.getTxtRPCByRpId = function(rpId, select, cb) {
	TxtRPC.findAndCountAll({
		where: { rpId: rpId },
		attributes:  select
	}).then(function(items) {
		cb(items.rows, items.count)
	})
};


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
exports.addTxtRPC = function (opts, cb) {
	delete opts.id
	return TxtRPC.create(opts).then(rpc => {
		cb(!rpc, rpc.dataValues)
	})
}
exports.updateTxtRPC = function (id, opts, cb) {
	return TxtRPC.update(opts, { where: { id: id } }).then(rp => {
		cb(!rp, rp[0])
	})
}
exports.removeTxtRPC = function (id, cb) {
	return TxtRPC.destroy({ where: { id: id } }).then(rp => {
		cb(!rp, rp[0])
	})
}