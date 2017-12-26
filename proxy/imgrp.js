const models = require('../models')
const ImgRP  = models.ImgRP
const ImgRPC = models.ImgRPC
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
exports.getImgRPList = function(query, select, cb) {
	var qs = Tools.querySearch(query, select)
	ImgRP.findAndCountAll(qs.opts).then(function(items) {
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
 * - items, 用户列表
 * @param {String}   key 推荐位KEY
 * @param {String}   name 推荐位名称
 * @param {String}   description 推荐位备注
 * @param {Array}    custemItems 自定义字段
 * @param {String}   id 创建者
 * @param {Function} cb 回调函数
 */
exports.addImgRP = function (key, name, description, custemItems, id, cb) {
	var imgrp = {
		key: key,
		name: name,
		description: description,
		custemItems: custemItems,
		userId: id,
		hash: Tools.hmac(key)
	}
	return ImgRP.create(imgrp).then(rp => {
		cb(!rp, rp.dataValues)
	})
}
exports.updateImgRP = function (id, opts, cb) {
	return ImgRP.update(opts, { where: { id: id } }).then(rp => {
		cb && cb(!rp, rp[0])
	})
}
exports.removeImgRP = function (id, cb) {
	ImgRP.findById(id).then(item => {
		item.getImgRPC().then(rpc => {
			console.log(rpc)
			var l = rpc.length
			if (l) {
				var ids = []
				for (var v of rpc) {
					ids.push(v.id)
				}
				ImgRPC.destroy({ where: { id: { $or: ids } } }).then(rp => {
					ImgRP.destroy({ where: { id: id } }).then(rp => {
						cb(!rp, rp[0])
					})
				})
			} else {
				ImgRP.destroy({ where: { id: id } }).then(rp => {
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
exports.getImgRPByQuery = function (query, cb) {
	return ImgRP.findOne({ where: query }).then(item => {
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
exports.getImgRPById = function (id, cb) {
	ImgRP.findById(id).then(item => {
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
exports.getImgRPCList = function(query, select, cb) {
	if (!query.sort) query.sort = 'sort'
	var qs = Tools.querySearch(query, select)
	ImgRPC.findAndCountAll(qs.opts).then(function(items) {
		cb(items.rows, {
			total: items.count,
			current: qs.page,
			pageSize: qs.opts.limit
		})
	})
}

exports.getImgRPCById = function (id, cb) {
	ImgRP.findById(id).then(item => {
		cb(item? item: null)
	})
}

// 根据条件查找推荐位内容
exports.getImgRPCByQuery = function (query, cb) {
	return ImgRPC.findOne({ where: query }).then(item => {
		cb(item? item: null)
	})
}

exports.getImgRPCByRpId = function(rpId, select, cb) {
	ImgRPC.findAndCountAll({
		where: { rpId: rpId },
		order: [['sort', 'ASC']],
		attributes:  select
	}).then(function(items) {
		cb(items.rows, items.count)
	})
};

exports.sortImgRPCByRpId = function(opts, cb) {
	var sort = opts.sort,
		l = 0,
		n = 0,
		s = 0;
	for (let p in sort) {
		++l
		ImgRPC.update({ sort: p }, { where: { id: sort[p] } }).then(rp => {
			++n
			if (rp) ++s
			if (n === l) {
				if (s === l) {
					cb(true)
				} else {
					cb(false)
				}
			}
		})
	}
	if (!l) cb(true)
};


/**
 * 根据内容创建推荐位
 * Callback:
 * - err, 数据库异常
 * - items, 用户列表
 * @param {String}   key 推荐位KEY
 * @param {String}   name 推荐位名称
 * @param {String}   description 推荐位备注
 * @param {Array}    custemItems 自定义字段
 * @param {String}   id 创建者
 * @param {Function} cb 回调函数
 */
exports.addImgRPC = function (opts, cb) {
	delete opts.id
	return ImgRPC.create(opts).then(rpc => {
		cb(rpc? rpc: null)
	})
}
exports.updateImgRPC = function (id, opts, cb) {
	return ImgRPC.update(opts, { where: { id: id } }).then(rp => {
		cb(!rp, rp[0])
	})
}
exports.removeImgRPC = function (id, cb) {
	return ImgRPC.destroy({ where: { id: id } }).then(rp => {
		cb(!rp, rp[0])
	})
}