const Schema = require('async-validator')
const Code   = require('./code')
const Tools  = require('./tools')

const RE = {
	email   : /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
	name    : /^([a-zA-Z0-9_-])+$/,
	phone   : /^1(3|4|5|7|8)\d{9}$/,
	password: /^[A-Za-z0-9]{6,20}$/,		// 6-20位字母数字组合
	isLetter: /[A-Za-z]+/,
	isNumber: /[\d]+/
}
const RULE = {
	// 登录名
	loginName(rule, val, cb, source, opts) {
		var err = []
		if (!(RE.email.test(val) || RE.phone.test(val) || RE.name.test(val))) {
			err.push({ message: '0022', field: rule.field })
		}
		cb(err)
	},
	// 用户名
	loginname: [
		{ type: 'string', message: '0021', required: true },
		{ type: 'string', message: '0022', pattern: RE.name }
	],
	// 密码
	password(rule, val, cb, source, opts) {
		var err = []
		if (val === '') {
			err.push({ message: '0021', field: rule.field })
		} else if (!RE.password.test(val) || (!RE.isLetter.test(val) || !RE.isNumber.test(val))) {
			err.push({ message: '0023', field: rule.field })
		}
		cb(err)
	},
	// 密码确认
	passwordR(rule, val, cb, source, opts) {
		var pass = source.password || '',
			err = []
		if (val != pass) err.push({ message: '0024', field: rule.field })
		cb(err)
	},
	// 邮箱
	email: [
		{ type: 'string', message: '0021', required: true },
		{ type: 'email', message: '0025' },
	],
	// 图片推荐位KEY
	imgrpKey: [
		{ type: 'string', message: '0121', required: true },
		{ type: 'string', message: '0121', pattern: RE.name }
	],
	// 图片推荐位名称
	imgrpName: [
		{ type: 'string', message: '0122', required: true }
	],
	// 图片推荐位内容标题
	imgRPCTitle: [
		{ type: 'string', message: '0132', required: true },
		{ type: 'string', min: 1, max: 100, message: '0131' }
	],
	// 图片地址
	imageUrl: [
		{ type: 'string', message: '0114', required: true }
	]
}

const rule = {
	reg: {
		loginname: RULE.loginname,
		password:  RULE.password,
		passwordR: RULE.passwordR,
		email:     RULE.email
	},
	login: {
		loginname: RULE.loginName,
		password:  RULE.password
	},
	imgrp: {
		key:  RULE.imgrpKey,
		name: RULE.imgrpName
	},
	imgrpUp: {
		name: RULE.imgrpName
	},
	imgrpc: {
		title:    RULE.imgRPCTitle,
		imageUrl: RULE.imageUrl
	},
	txtrp: {
		key:  RULE.imgrpKey,
		name: RULE.imgrpName
	},
	txtrpUp: {
		name: RULE.imgrpName
	},
	txtrpc: {
		title: RULE.imgRPCTitle
	},
	temp: {
		key:  RULE.imgrpKey,
		name: RULE.imgrpName
	},
	tempc: {
		title: RULE.imgrpName
	},
	tempUp: {
		name: RULE.imgrpName
	},
	shop: {
		key:  RULE.imgrpKey,
		name: RULE.imgrpName
	},
	shopc: {
		title: RULE.imgrpName
	},
	shopUp: {
		name: RULE.imgrpName
	},
	page: {
		key:  RULE.imgrpKey,
		name: RULE.imgrpName
	},
	pagec: {
		title: RULE.imgrpName
	},
	pageUp: {
		name: RULE.imgrpName
	},
	store: {
		key:  RULE.imgrpKey,
		name: RULE.imgrpName
	},
	storec: {
		title: RULE.imgrpName
	},
	storeUp: {
		name: RULE.imgrpName
	},
}

var Valid = {
	schema: function(type) {
		return new Schema(rule[type])
	},
	run: function(res, type, data, cb, er) {
		this.schema(type).validate(data, (err, fields) => {
			if (!err) return cb && cb()
			if (er) {
				er(err[0].message)
			} else {
				Tools.errHandle(err[0].message, res)
			}
		})
	},
	RE: RE
}

module.exports = Valid

