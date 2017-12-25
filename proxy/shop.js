const models = require('../models')
const Shop   = models.Shop
const ShopC  = models.ShopC
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
exports.getShopList = function(query, select, cb) {
	var qs = Tools.querySearch(query, select)
	Shop.findAndCountAll(qs.opts).then(function(items) {
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
exports.addShop = function (key, name, description, id, cb) {
	var imgrp = {
		key: key,
		name: name,
		description: description,
		userId: id,
		hash: Tools.hmac(key)
	}
	return Shop.create(imgrp).then(rp => {
		cb(!rp, rp.dataValues)
	})
}
exports.updateShop = function (id, opts, cb) {
	return Shop.update(opts, { where: { id: id } }).then(rp => {
		cb && cb(!rp, rp[0])
	})
}
exports.removeShop = function (id, cb) {
	Shop.findById(id).then(item => {
		item.getShopC().then(rpc => {
			var l = rpc.length
			if (l) {
				var ids = []
				for (var v of rpc) {
					ids.push(v.id)
				}
				ShopC.destroy({ where: { id: { $or: ids } } }).then(rp => {
					Shop.destroy({ where: { id: id } }).then(rp => {
						cb(!rp, rp[0])
					})
				})
			} else {
				Shop.destroy({ where: { id: id } }).then(rp => {
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
exports.getShopByQuery = function (query, cb) {
	return Shop.findOne({ where: query }).then(item => {
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
exports.getShopById = function (id, cb) {
	Shop.findById(id).then(item => {
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
exports.getShopCList = function(query, select, cb) {
	var qs = Tools.querySearch(query, select)
	ShopC.findAndCountAll(qs.opts).then(function(items) {
		cb(items.rows, {
			total: items.count,
			current: qs.page,
			pageSize: qs.opts.limit
		})
	})
}
// 根据条件查找推荐位内容
exports.getShopCByQuery = function (query, cb) {
	return ShopC.findOne({ where: query }).then(item => {
		cb(item? item: null)
	})
}

exports.getShopCById = function (id, cb) {
	ShopC.findById(id).then(item => {
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
exports.addShopC = function (opts, cb) {
	delete opts.id
	return ShopC.create(opts).then(rpc => {
		cb(!rpc, rpc.dataValues)
	})
}
exports.updateShopC = function (id, opts, cb) {
	if (opts.active === undefined) {
		opts.header = opts.header || ''
		opts.footer = opts.footer || ''
		opts.modelItems = opts.modelItems || '[]'
	}
	return ShopC.update(opts, { where: { id: id } }).then(rp => {
		cb(!rp, rp[0])
	})
}
exports.removeShopC = function (id, cb) {
	return ShopC.destroy({ where: { id: id } }).then(rp => {
		cb(!rp, rp[0])
	})
}