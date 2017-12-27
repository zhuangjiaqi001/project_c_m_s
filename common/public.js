const moment  = require('moment')
const crypto  = require('crypto')
const Code    = require('./code')
const config  = require('../config')
const Mapping = require('./mapping')
const Aliyun  = require('./aliyun')
const proxy   = require('../proxy')
const Tools   = require('./tools')
const Shop    = proxy.Shop
const Store   = proxy.Store
const Temp    = proxy.Temp
const Log     = proxy.Log
const swig    = require('swig')
const jsframe = Tools.getJSFrame()
const tpl     = swig.compileFile('template/t0.html', { autoescape: false })
const tprev   = swig.compileFile('template/tp.html', { autoescape: false })

var alifmat   = {
	html: '0105',
	css:  '0106',
	js:   '0107',
	json: '0107',
}
var RP = {
	pn:      /\S+cms\/[a-z]{2}\//,
}
var typeRP = {
	update:  /\/update/,
	add:     /\/add/,
	remove:  /\/remove/,
	release: /\/release/,
	offline: /\/offline/,
	sort:    /\/sort/,
}

var Public = {
	get: {
		// 获取编辑内容 ( 编辑页面 )
		getTempShop: function(item, res, cb) {
			item = item.dataValues? item.dataValues: item
			var me    = this,
				len   = 1,
				now   = 0,
				temps = {};
			me.filterTempIds(item, function(ids, item) {
				Temp.getTempCByIds(ids, function(items) {
					items.map(function(i) {
						temps[i.id] = i
					})
					if (item.header) item.header = temps[item.header]
					if (item.footer) item.footer = temps[item.footer]
					if (item.modelItems) {
						var mi = []
						item.modelItems.map(function(i) {
							mi.push(temps[i])
						})
						item.modelItems = mi
					}

					me.getAliyun(item, res, function(item) {
						++now;
						(len === now) && cb && cb(item)
					})
				})
			})
			if (item.shopcId) {
				++len
				Shop.getShopCById(item.shopcId, function(shop) {
					++now;
					item.shop = shop.dataValues;
					(len === now) && cb && cb(item)
				})
			}
		},
		// 获取数据渲染页面
		getShopRender: function(item, res, cb) {
			item = item.dataValues? item.dataValues: item
			var me    = this,
				temps = {};
			if (!item.shopcId) return me.getTemp(item, res, cb)

			Shop.getShopCById(item.shopcId, function(shop) {
				shop = shop.dataValues;
				item.js         = shop.js
				item.css        = shop.css
				item.header     = shop.header
				item.footer     = shop.footer
				item.modelItems = shop.modelItems
				me.getTemp(item, res, cb)
			})
		},
		getTemp: function(item, res, cb) {
			var me = this
			me.filterTempIds(item, function(ids, item) {
				Temp.getTempCByIds(ids, function(items) {
					var temps = {}, js = [], css = []
					items.map(function(i) {
						temps[i.id] = i
					})
					if (item.html) temps['body'] = { html: item.html }
					me.getAliyunHTML(temps, res, function(temps) {
						if (item.header) item.header = me.modelfilter(temps[item.header], js, css)
						if (item.css)  css.push(item.css)
						if (item.js)   js.push(item.js)
						if (item.modelItems) {
							var mi = []
							item.modelItems.map(function(i) {
								mi.push(me.modelfilter(temps[i], js, css))
							})
							item.modelItems = mi
						}
						if (item.footer) item.footer = me.modelfilter(temps[item.footer], js, css)
						item.js  = Tools.unique(js)
						item.css = Tools.unique(css)
						if (temps.body) item.html = temps['body'].html
						me.createPage(item, res, cb)
					})
				})
			})
		},
		// 过滤ID ( by getTempShop )
		filterTempIds: function(item, cb) {
			var ids = []
			if (item.modelItems) {
				ids = JSON.parse(JSON.stringify(item.modelItems))
			}
			if (item.header) ids.push(item.header)
			if (item.footer) ids.push(item.footer)

			cb && cb(Tools.unique(ids), item)
		},
		// 获取 HTML, CSS, JS, JSON 数据 ( by getTempShop )
		getAliyun: function(body, res, cb) {
			var len  = 0,
				now  = 0;
			for (let i in alifmat) {
				let p = body[i]
				if (p) {
					++len
					Aliyun.getFile(p.replace(RP.pn, ''), function(err, result) {
						if (err) return Tools.errHandle(alifmat[p], res)
						body[i] = result
						++now
						if (now === len) cb(body)
					})
				}
			}
			if (!len) cb(body)
		},
		getAliyunHTML: function(temps, res, cb) {
			var len = 0,
				now = 0,
				err
			for (let p in temps) {
				if (!temps[p].html) return
				++len
				var mt = temps[p].html.replace(RP.pn, '')
				if (!mt) return
				Aliyun.getFile(mt, function(err, result) {
					if (err) err = err
					temps[p].html = result
					++now
					if (now === len) {
						if (err) return Tools.errHandle('0105', res)
						return cb(temps)
					}
				})
			}
			if (!len) return cb(temps)
		},
		// 模块过滤
		modelfilter: function(obj, js, css) {
			if (!obj) return ''
			var cis  = obj.custemItems
			if (cis.length) {
				cis.map(function(i) {
					js.push(jsframe[i.name])
				})
			}
			if (obj.css) css.push(obj.css)
			if (obj.js)  js.push(obj.js)
			return {
				html: obj.html
			}
		},
		// 创建页面
		createPage: function(item, res, cb) {
			var mi = typeof item.modelItems === 'string'? JSON.parse(item.modelItems): item.modelItems

			if (item.renderType && renderType[item.renderType]) renderType[item.renderType](item)

			var prev = tpl({
				title:   `${item.title}`,
				body:    item.html,
				css:     item.css,
				js:      item.js,
				model:   mi,
				header:  item.header? item.header.html || '': '',
				footer:  item.footer? item.footer.html || '': '',
				width:   item.width || '1000'
			})
			cb && cb(prev)
		}
	},
	set: {
		uploadAliyun: function(body, pathname, res, cb) {
			var len  = 0,
				now  = 0;
			for (let i in alifmat) {
				let p = body[i]
				if (p) {
					++len
					Aliyun.uploadFile(p, `0.${i}`, pathname, function(err, url) {
						if (err) return Tools.errHandle(alifmat[p].replace('010', '011'), res)
						body[i] = url
						++now
						if (now === len) cb(body)
					})
				}
			}
			if (!len) cb(body)
		},
		decodeURIC: function(body) {
			try {
				body.html = decodeURIComponent(body.html) || ''
				body.css  = decodeURIComponent(body.css)  || ''
				body.js   = decodeURIComponent(body.js)   || ''
				return body
			} catch(err) {
				return false
			}
		},
		log: function(req, cb) {
			if (req.method !== 'POST') return cb && cb();
			var url  = req.originalUrl,
				type = logType.get(url),
				opts = {
					userId: req.userId,
					directive: type[0],
					loginname: req.loginname,
				}
			if (type[1]) logType.set(type[1], opts, req.body)
			Log.addLog(opts, function() {
				cb && cb()
			})
		},
	},
}

var logType = {
	get: function(url) {
		var p = 'add'
		for (var i in typeRP) {
			if (typeRP[i].test(url)) {
				p = i
				break;
			}
		}
		var ma = url.match(/api\/(.+)\//)
		return [p, ma? ma[1]: '']
	},
	set: function(name, opts, body) {
		// if (body[`${name}Id`]) {
		// 	opts[`${name}cId`] = body.id
		// } else {
		// 	opts[`${name}Id`] = body.id
		// }

		if (body[`${name}Id`] || body[`rpId`]) {
			opts.type = `${name}c`
			opts.desc = `${body.name || ''},${body.title || ''}`
		} else {
			opts.type = name
			if (name === 'file') {
				opts.desc = body.fileUrl || ''
			} else {
				opts.desc = body.name || body.loginname || ''
			}
		}
	}
}

var renderType = {
	shop_editor: function(item) {
		item.js.unshift( jsframe.vue_2_2_6, jsframe.jq_1_12_4 )
		item.css.push( '/js/util/e-edit/e-edit-edit.css', '/js/util/e-edit/fa/fa.css' )
		item.js.push( '/js/util/e-edit/e-edit-edit.js' )
	},
	shop_prev: function(item) {
		item.js.unshift( jsframe.vue_2_2_6, jsframe.jq_1_12_4 )
		item.css.push( '/js/util/e-edit/e-edit-view.css' )
		item.js.push( '/js/util/e-edit/e-edit-view.js' )
	},
	temp_prev: function(item) {
		item.css.push( '/js/util/t-temp/t-temp-prev.css' )
	}
}

module.exports = Public

