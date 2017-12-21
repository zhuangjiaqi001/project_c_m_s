const models = require('../models')
const Store   = models.Store
const StoreC  = models.StoreC
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
exports.getStoreList = function(query, select, cb) {
	var qs = Tools.querySearch(query, select)
	Store.findAndCountAll(qs.opts).then(function(items) {
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
exports.addStore = function (key, name, description, id, cb) {
	var imgrp = {
		key: key,
		name: name,
		description: description,
		userId: id,
		hash: Tools.hmac(key)
	}
	return Store.create(imgrp).then(rp => {
		cb(!rp, rp.dataValues)
	})
}
exports.updateStore = function (id, opts, cb) {
	return Store.update(opts, { where: { id: id } }).then(rp => {
		cb && cb(!rp, rp[0])
	})
}
exports.removeStore = function (id, cb) {
	Store.findById(id).then(item => {
		item.getStoreC().then(rpc => {
			var l = rpc.length
			if (l) {
				var ids = []
				for (var v of rpc) {
					ids.push(v.id)
				}
				StoreC.destroy({ where: { id: { $or: ids } } }).then(rp => {
					Store.destroy({ where: { id: id } }).then(rp => {
						cb(!rp, rp[0])
					})
				})
			} else {
				Store.destroy({ where: { id: id } }).then(rp => {
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
exports.getStoreByQuery = function (query, cb) {
	return Store.findOne({ where: query }).then(item => {
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
exports.getStoreById = function (id, cb) {
	Store.findById(id).then(item => {
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
exports.getStoreCList = function(query, select, cb) {
	var qs = Tools.querySearch(query, select)
	StoreC.findAndCountAll(qs.opts).then(function(items) {
		cb(items.rows, {
			total: items.count,
			current: qs.page,
			pageSize: qs.opts.limit
		})
	})
}
// 根据条件查找推荐位内容
exports.getStoreCByQuery = function (query, cb) {
	return StoreC.findOne({ where: query }).then(item => {
		cb(item? item: null)
	})
}
exports.getStoreCById = function (id, cb) {
	return StoreC.findById(id).then(item => {
		cb(item? item: null)
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
exports.addStoreC = function (opts, cb) {
	delete opts.id

	if (opts.modelItems) {
		var mod = []
		opts.modelItems.map(function(i) { mod.push(i.id) })
		opts.modelItems = Tools.unique(mod)
	}
	opts.header = opts.header? opts.header.id: ''
	opts.footer = opts.footer? opts.footer.id: ''
	return StoreC.create(opts).then(rpc => {
		cb(!rpc, rpc.dataValues)
	})
}
exports.updateStoreC = function (id, opts, cb) {
	if (opts.modelItems) {
		var mod = []
		opts.modelItems.map(function(i) { mod.push(i.id) })
		opts.modelItems = Tools.unique(mod)
	}
	opts.header = opts.header? opts.header.id: ''
	opts.footer = opts.footer? opts.footer.id: ''
	return StoreC.update(opts, { where: { id: id } }).then(rp => {
		cb(!rp, rp[0])
	})
}
exports.removeStoreC = function (id, cb) {
	return StoreC.destroy({ where: { id: id } }).then(rp => {
		cb(!rp, rp[0])
	})
}