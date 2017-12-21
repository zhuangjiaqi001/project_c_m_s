const router  = require('express').Router()
const Cache   = require('../../models/cache')
const proxy   = require('../../proxy')
const Temp    = proxy.Temp
const Aliyun  = require('../../common/aliyun')
const Tools   = require('../../common/tools')
const Valid   = require('../../common/valid')
const Edit    = require('../../common/edit')
const swig    = require('swig')
const tempEdit  = Edit.Temp
const tempcEdit = Edit.TempC
const tpl       = swig.compileFile('template/t0.html', { autoescape: false })
const tprev     = swig.compileFile('template/tp.html', { autoescape: false })


var RP = {
	pn: /\S+cms\/[a-z]{2}\//
}

// 创建推荐位
router.get('/get', (req, res, next) => {
	var q      = req.query,
		id     = q.id,
		userId = req.signedCookies.id

	Temp.getTempByQuery({
		'id':  id
	}, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		Tools.errHandle('0000', res, item)
	})
})
router.post('/addTemp', (req, res, next) => {
	var id   = req.signedCookies.id,
		body = req.body,
		key  = body.key,
		name = body.name,
		description = body.description
	Valid.run(res, 'temp', body, function() {
		Temp.getTempByQuery({
			'key':  key,
			'name': name
		}, function (item) {
			if (item) return Tools.errHandle('0123', res)

			Temp.addTemp(key, name, description, id, function (err) {
				if (err) return Tools.errHandle('0124', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/updateTemp', (req, res, next) => {
	var body = req.body,
		id   = body.id

	var bodyFilter = Tools.bodyFilter(tempEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'tempUp', body, function() {
		Temp.getTempById(id, function (item) {
			if (!item) return Tools.errHandle('0128', res)
			Temp.updateTemp(id, body, function (err) {
				if (err) return Tools.errHandle('0130', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/removeTemp', (req, res, next) => {
	var body = req.body,
		id   = body.id

	Temp.getTempById(id, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		if (item.active)  return Tools.errHandle('0134', res)
		Temp.removeTemp(id, function (err) {
			if (err) return Tools.errHandle('0130', res)
			Tools.errHandle('0000', res)
		})
	})
})


// 获取推荐位列表
router.get('/getTempList', (req, res, next) => {
	var query  = req.query,
		select = ['key', 'name', 'description', 'id', 'createdAt', 'updatedAt']

	Temp.getTempList(query, select, function (items, pageInfo) {

		Tools.errHandle('0000', res, {
			list: items,
			pageInfo: pageInfo
		})
	})
})


// 创建推荐位内容
router.get('/getC', (req, res, next) => {
	var q      = req.query,
		id     = q.id,
		tempId = q.tempId,
		userId = req.signedCookies.id

	Temp.getTempCByQuery({
		tempId: tempId,
		id: id
	}, function(o) {
		var key      = o.key,
			pathname = `tempc/${key}`
		if (!o) return Tools.permit('对不起！该模板类不存在！', res)
		getAliyun(o, pathname, res, function(o) {
			Tools.errHandle('0000', res, o)
		})
	})
})
router.post('/addTempC', (req, res, next) => {
	var body   = req.body,
		userId = req.signedCookies.id,
		tempId = body.tempId,
		key    = `tempc_${Date.now()}`,
		html   = body.html? body.html: '',
		css    = body.css?  body.css:  '',
		js     = body.js?   body.js:   '',
		pathname = `tempc/${key}`

	body.custemItems = body.custemItems || []

	if (!tempId) return Tools.errHandle('0126', res)

	Temp.getTempCByQuery({
		key: key
	}, function(item) {
		if (item) return Tools.errHandle('0163', res)
		uploadAliyun(html, css, js, pathname, body, res, function(body) {
			body.userId = userId
			Temp.addTempC(body, function (err) {
				if (err) return Tools.errHandle('0123', res)
				Tools.errHandle('0000', res)
			})
		})
	})
})
router.post('/updateTempC', (req, res, next) => {
	var body   = req.body,
		id     = body.id,
		userId = req.signedCookies.id,
		tempId = body.tempId,
		html   = body.html || '',
		css    = body.css  || '',
		js     = body.js   || ''

	body.custemItems = body.custemItems || []
	
	var bodyFilter = Tools.bodyFilter(tempcEdit, body)
	body = bodyFilter.obj

	Valid.run(res, 'tempc', body, function() {
		Temp.getTempCById(id, function(item) {
			if (!item) return Tools.errHandle('0163', res)
			var key      = item.key,
				pathname = `tempc/${key}`;
			uploadAliyun(html, css, js, pathname, body, res, function(body) {
				body.userId = userId
				Temp.updateTempC(id, body, function (err) {
					if (err) return Tools.errHandle('0130', res)
					Tools.errHandle('0000', res)
				})
			})
		})
	})
})
router.post('/removeTempC', (req, res, next) => {
	var body = req.body

	Temp.getTempCByQuery(body, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		Temp.removeTempC(body.id, function (err) {
			if (err) return Tools.errHandle('0133', res)
			Tools.errHandle('0000', res)
		})
	})
})
router.post('/copyTempC', (req, res, next) => {
	var body = req.body

	Temp.getTempCByQuery(body, function (item) {
		if (!item) return Tools.errHandle('0128', res)
		item = item.dataValues
		var da = {
			key:         `tempc_${Date.now()}`,
			tempId:      item.tempId,
			userId:      item.userId,
			title:       `${item.title}_copy_${Date.now()}`,
			html:        item.html,
			js:          item.js,
			css:         item.css,
			custemItems: item.custemItems,
			type:        item.type,
		}
		Temp.addTempC(da, function (err) {
			if (err) return Tools.errHandle('0123', res)
			Tools.errHandle('0000', res)
		})
	})
})


// 获取推荐位内容列表
router.get('/getTempCList', (req, res, next) => {
	var query  = req.query
	var select = ['tempId', 'key', 'title', 'preview', 'createdAt', 'updatedAt']
	Temp.getTempCList(query, select, function (items, pageInfo) {
		Tools.errHandle('0000', res, {
			list: items,
			pageInfo: pageInfo
		})
	})
})
function getAliyun(body, pathname, res, cb) {
	var len  = 0,
		now  = 0,
		html = body.html,
		css  = body.css,
		js   = body.js
	if (html) ++len
	if (css)  ++len
	if (js)   ++len
	if (!len) cb(body)

	if (html) {
		Aliyun.getFile(html.replace(RP.pn, ''), function(err, result) {
			if (err) return Tools.errHandle('0105', res)
			body.html = result
			++now
			if (now === len) cb(body)
		})
	}
	if (css) {
		Aliyun.getFile(css.replace(RP.pn, ''), function(err, result) {
			if (err) return Tools.errHandle('0106', res)
			body.css = result
			++now
			if (now === len) cb(body)
		})
	}
	if (js) {
		Aliyun.getFile(js.replace(RP.pn, ''), function(err, result) {
			if (err) return Tools.errHandle('0107', res)
			body.js = result
			++now
			if (now === len) cb(body)
		})
	}
}
function uploadAliyun(html, css, js, pathname, body, res, cb) {
	var len = 0, now = 0
	body.html = body.css = body.js = ''
	if (html) ++len
	if (css)  ++len
	if (js)   ++len
	if (!len) cb(body)
	if (html) {
		Aliyun.uploadFile(html, '0.html', pathname, function(err, url) {
			if (err) return Tools.errHandle('0115', res)
			body.html = url
			++now
			if (now === len) createPrev(html, body, pathname, res, cb)
		})
	}
	if (css) {
		Aliyun.uploadFile(css, '0.css', pathname, function(err, url) {
			if (err) return Tools.errHandle('0116', res)
			body.css = url
			++now
			if (now === len) createPrev(html, body, pathname, res, cb)
		})
	}
	if (js) {
		Aliyun.uploadFile(js, '0.js', pathname, function(err, url) {
			if (err) return Tools.errHandle('0117', res)
			body.js = url
			++now
			if (now === len) createPrev(html, body, pathname, res, cb)
		})
	}
}
function createPrev(html, body, pathname, res, cb) {
	var prev = tprev({
		title:   `${body.title}_${body.name}`,
		jsframe: Tools.getJSFrame(),
		items:   body.custemItems,
		body:    html,
		css:     body.css,
		js:      body.js
	})
	Aliyun.uploadFile(prev, 'prev.html', pathname, function(err, url) {
		if (err) return Tools.errHandle('0118', res)
		body.preview = url
		cb(body)
	})
}

module.exports = router