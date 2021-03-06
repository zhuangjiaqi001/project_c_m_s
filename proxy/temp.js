const models = require('../models')
const Temp   = models.Temp
const TempC  = models.TempC
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
exports.getTempList = function(query, select, cb) {
	var qs = Tools.querySearch(query, select)
	Temp.findAndCountAll(qs.opts).then(function(items) {
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
exports.addTemp = function (key, name, description, id, cb) {
	var imgrp = {
		key: key,
		name: name,
		description: description,
		userId: id,
		hash: Tools.hmac(key)
	}
	return Temp.create(imgrp).then(rp => {
		cb(!rp, rp.dataValues)
	})
}
exports.updateTemp = function (id, opts, cb) {
	return Temp.update(opts, { where: { id: id } }).then(rp => {
		cb && cb(!rp, rp[0])
	})
}
exports.removeTemp = function (id, cb) {
	Temp.findById(id).then(item => {
		item.getTempC().then(rpc => {
			var l = rpc.length
			if (l) {
				var ids = []
				for (var v of rpc) {
					ids.push(v.id)
				}
				TempC.destroy({ where: { id: { $or: ids } } }).then(rp => {
					Temp.destroy({ where: { id: id } }).then(rp => {
						cb(!rp, rp[0])
					})
				})
			} else {
				Temp.destroy({ where: { id: id } }).then(rp => {
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
exports.getTempByQuery = function (query, cb) {
	return Temp.findOne({ where: query }).then(item => {
		cb(item? item: null)
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
exports.getTempById = function (id, cb) {
	Temp.findById(id).then(item => {
		cb(item? item: null)
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
exports.getTempCList = function(query, select, cb) {
	var qs = Tools.querySearch(query, select)
	TempC.findAndCountAll(qs.opts).then(function(items) {
		cb(items.rows, {
			total: items.count,
			current: qs.page,
			pageSize: qs.opts.limit
		})
	})
}
// 根据条件查找推荐位内容
exports.getTempCByQuery = function (query, cb) {
	return TempC.findOne({ where: query }).then(item => {
		cb(item? item: null)
	})
}

exports.getTempCById = function (id, cb) {
	return TempC.findById(id).then(item => {
		cb(item? item: null)
	})
}

exports.getTempCByRpId = function(tempId, select, cb) {
	TempC.findAndCountAll({
		where: { tempId: tempId },
		attributes:  select
	}).then(function(items) {
		cb(items.rows, items.count)
	})
};

// exports.getTempCByRpIds = function(ids, select, cb) {
// 	TempC.findAndCountAll({
// 		where: {
// 			id: ids
// 		},
// 		attributes:  select
// 	}).then(function(items) {
// 		cb(items.rows, items.count)
// 	})
// };

exports.getTempCByIds = function(ids, cb) {
	TempC.findAll({
		where: { id: ids }
	}).then(function(items) {
		cb(items)
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
exports.addTempC = function (opts, cb) {
	delete opts.id
	return TempC.create(opts).then(rpc => {
		cb(!rpc, rpc.dataValues)
	})
}
exports.updateTempC = function (id, opts, cb) {
	return TempC.update(opts, { where: { id: id } }).then(rp => {
		cb(!rp, rp[0])
	})
}
exports.removeTempC = function (id, cb) {
	return TempC.destroy({ where: { id: id } }).then(rp => {
		cb(!rp, rp[0])
	})
}