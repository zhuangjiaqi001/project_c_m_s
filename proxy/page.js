const models = require('../models')
const Page   = models.Page
const PageC  = models.PageC
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
exports.getPageList = function(query, select, cb) {
	var qs = Tools.querySearch(query, select)
	Page.findAndCountAll(qs.opts).then(function(items) {
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
exports.addPage = function (key, name, description, id, cb) {
	var imgrp = {
		key: key,
		name: name,
		description: description,
		userId: id
	}
	return Page.create(imgrp).then(rp => {
		cb(!rp, rp.dataValues)
	})
}
exports.updatePage = function (id, opts, cb) {
	return Page.update(opts, { where: { id: id } }).then(rp => {
		cb && cb(!rp, rp[0])
	})
}
exports.removePage = function (id, cb) {
	Page.findById(id).then(item => {
		item.getPageC().then(rpc => {
			console.log(rpc)
			var l = rpc.length
			if (l) {
				var ids = []
				for (var v of rpc) {
					ids.push(v.id)
				}
				PageC.destroy({ where: { id: { $or: ids } } }).then(rp => {
					Page.destroy({ where: { id: id } }).then(rp => {
						cb(!rp, rp[0])
					})
				})
			} else {
				Page.destroy({ where: { id: id } }).then(rp => {
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
exports.getPageByQuery = function (query, cb) {
	return Page.findOne({ where: query }).then(item => {
		cb(item? items: null)
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
exports.getPageById = function (id, cb) {
	Page.findById(id).then(item => {
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
exports.getPageCList = function(query, select, cb) {
	var qs = Tools.querySearch(query, select)
	PageC.findAndCountAll(qs.opts).then(function(items) {
		cb(items.rows, {
			total: items.count,
			current: qs.page,
			pageSize: qs.opts.limit
		})
	})
}
// 根据条件查找推荐位内容
exports.getPageCByQuery = function (query, cb) {
	return PageC.findOne({ where: query }).then(item => {
		cb(item? item: null)
	})
}

exports.getPageCById = function(id, cb) {
	PageC.findById(id).then(item => {
		cb(item? item: null)
	})
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
exports.addPageC = function (opts, cb) {
	delete opts.id
	return PageC.create(opts).then(rpc => {
		cb(!rpc, rpc.dataValues)
	})
}
exports.updatePageC = function (id, opts, cb) {
	return PageC.update(opts, { where: { id: id } }).then(rp => {
		cb(!rp, rp[0])
	})
}
exports.removePageC = function (id, cb) {
	return PageC.destroy({ where: { id: id } }).then(rp => {
		cb(!rp, rp[0])
	})
}