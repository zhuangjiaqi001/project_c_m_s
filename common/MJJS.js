'use strict';

// const http = require('http');
const cookieSecret = (new Buffer('mengju.com')).toString('base64');
var config  = require('../config');
const request = require('request');
const cipher = require('./cipher.js');
const util = require('util');
const fs = require('fs');
const crypto = require('crypto');

const MJJS = {
	/*
	 *  String处理
	 */
	getQueryValue: function(url, key) {
		const reg = new RegExp("(^|&|\\?|#)" + key + "=([^&]*)(&|\x24)", "");
		const match = url.match(reg);
		return (match) ? match[2] : '';
	},
	/*
	 *  对象处理
	 */
	obj: {
		isEmptyObject: function(obj) { 
			for (var name in obj) { return false; }
			return true;
		}
	},
	/*
	 *  format
	 */
	format: function(query) {
		var arr = [];
		for (var p in query) {
			arr.push(p + '=' + query[p]);
		}
		return arr.join('&');
	},
	/*
	 *  base64
	 */
	base64: function(method, url) {
		const str = [method, url].join(':');
		const key = new Buffer(str).toString('base64');
		return key;
	},
	/*
	 *  数据请求
	 */
	http: {
		result: function(err, res, data, success, error) {
			if (!err) {
				console.log('===================== RESPONSE =====================');
				console.log(data);
				if (res.statusCode === 200) {
					typeof(success) === 'function' && success(data, res);
				} else {
					typeof(error) === 'function' && error(data);
				}
			} else {
				console.log('===================== ERROR =====================');
				console.log(err);
				typeof(error) === 'function' && error(err);
			}
		},
		get: function(url, success, error) {
			var me = this;
			var uri = config.api + url;
			var opts = {
				url: uri,
				json: true
			};
			console.log('===================== API =====================');
			console.log(uri);
			request.get(opts, function (err, res, data) {
				me.result(err, res, data, success, error);
			});
		},
		post: function(url, reqData, success, error) {
			var me = this;
			var uri = config.api + url;
			var opts = {
				url: uri,
				json: true,
				form: reqData
			};
			console.log('===================== API =====================');
			console.log(uri);
			console.log('===================== DATA =====================');
			console.log(reqData);
			request.post(opts, function (err, res, data) {
				me.result(err, res, data, success, error);
			});
		},
		mkdir: function(path, callback) {
			fs.exists(path, function(exists) {
				if (exists) {
					callback && callback();
				} else {
					fs.mkdirSync(path);
					callback && callback();
				}
			});
		},
		file: function(url, body, file, success, error) {
			var path = __dirname.replace('common', 'upload');
			var me = this;
			this.mkdir(path, () => {
				var opts = {
					url: config.api + url,
					json: true,
					formData: {
						file: fs.createReadStream(file.file.path),
						sign: body.sign,
						userId: body.userId,
						token: body.token
					}
				};

				request.post(opts, function optionalCallback(err, res, data) {
					console.log(err, data);
					fs.unlinkSync(file.file.path);
					me.result(err, res, data, success, error);
				});
			});
		}
	},
	/*
	 *  JSON数据排序
	 */
	sort: function(json, token) {
		var arr = [];
		if (json) {
			for (var p in json) {
				arr.push(json[p]);
			}
		}
		var code = arr.sort().join('') + (token || ''),
			md5  = crypto.createHash('md5');
		md5.update(code);
		return md5.digest('hex');
	},
	/*
	 *  valid
	 */
	valid: function (url, query, req, res, next, callback) {
		var query = query || {};
		var token  = req.signedCookies.token,
			userId = req.signedCookies.userId,
			sign     = MJJS.sort(query, token);
		query.sign   = sign;
		query.userId = userId;
		query.token  = token;
		MJJS.http.get('/api'+url + '?' + MJJS.format(query), function(data) {
			res.cookie('token', token, config.cookieCtrl);
			res.cookie('userId', userId, config.cookieCtrl);
			if (data.code === '0') {
				typeof(callback) === 'function' && callback(data.data);
			} else {
				next();
			}
		}, function(err) {
			next();
		});
	},
	/*
	 *  cookie
	 */
	cookie: {
		// cookie 秘钥放在这里
		secret: cookieSecret
	},
	cipher: {
		encrypt: function(str) {
			return cipher.encrypt(str);
		},
		decrypt: function(str) {
			return cipher.decrypt(str);
		}
	},
	mapKey: 'AIzaSyBpv83qoZJrtW32r-e-E2ZkXwcYGOZUzrI',
	/*
	 *  权限判断
	 */
	permit: function(req, res, api) {
		var permit = req.session.permit;
		if (('/api'+api) in permit) {
			return 1;
		} else {
			res.render('ERROR_PERMIT', {
				title: '对不起！您没有该页面的访问权限！',
				listMenu: req.session.listMenu
			});
			return 0;
		};
	}
};

module.exports = MJJS;