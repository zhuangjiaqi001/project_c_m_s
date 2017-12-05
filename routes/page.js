const router  = require('express').Router()
const proxy   = require('../proxy')
const Tools   = require('../common/tools')
const Page    = proxy.Page
const Temp    = proxy.Temp
const Aliyun  = require('../common/aliyun')

// 落地页列表
const active  = 'page'

// 列表
router.get('/', (req, res, next) => {
	res.render('page', {
		active: active,
		title: '落地页列表'
	})
})

// 创建
router.get('/add', (req, res, next) => {
	res.render('page/add', {
		active: active,
		title: '新建落地页列表'
	})
})
// 编辑
router.get('/edit/:id', (req, res, next) => {
	var id = req.params.id
	Page.getPageById(id, function(o) {
		if (!o) return Tools.permit('对不起！该落地页列表不存在！', res)
		res.render('page/add', {
			active: active,
			title: '编辑落地页列表',
			pageInfo: o
		})
	})
})

// 落地页列表内容列表
router.get('/:id', (req, res, next) => {
	var id = req.params.id

	Page.getPageById(id, function(o) {
		if (!o) return Tools.permit('对不起！该落地页列表不存在！', res)
		res.render('page/list', {
			active: active,
			id: id,
			item: o,
			title: '落地页列表列表'
		})
	})
})

// 落地页列表内容创建
router.get('/:id/add', (req, res, next) => {
	var id = req.params.id

	Page.getPageById(id, function(o) {
		if (!o) return Tools.permit('对不起！该落地页列表不存在！', res)
		res.render('page/itemAdd', {
			active: active,
			item: o,
			title: '新建内容'
		})
	})
})

// 落地页列表内容编辑
router.get('/:pageId/edit/:id', (req, res, next) => {
	var params   = req.params,
		pageId   = params.pageId,
		id       = params.id,
		temps    = {}
	Page.getPageById(pageId, function(o) {
		if (!o) return Tools.permit('对不起！该落地页列表不存在！', res)
		Page.getPageCByQuery({
			pageId: pageId,
			id: id
		}, function(o2) {
			if (!o2) return Tools.permit('对不起！该落地页列表不存在！', res)

			Tools.getTempById(o2, function(ids, o2) {
				Temp.getTempCByRpIds(ids, ['id', 'title'], function(items, count) {
					items.map(function(i) {
						temps[i.dataValues.id] = i.dataValues
					})
					if (o2.header) o2.header = JSON.stringify(temps[o2.header])
					if (o2.footer) o2.footer = JSON.stringify(temps[o2.footer])
					if (o2.modelItems) {
						var mi = []
						o2.modelItems.map(function(i) {
							mi.push(temps[i])
						})
						o2.modelItems = JSON.stringify(mi)
					}

					getAliyun(o2, res, function(o2) {
						res.render('page/itemAdd', {
							active: active,
							title: '编辑内容',
							item: o,
							pagecInfo: o2
						})
					})
				})
			})
		})
	})
})

function getAliyun(body, res, cb) {
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
		var hmt = html.match(/(tempc|pagec)[\S]*html$/)[0]
		Aliyun.getFile(hmt, function(err, result) {
			if (err) return Tools.errHandle('0105', res)
			body.html = result
			++now
			if (now === len) cb(body)
		})
	}
	if (css) {
		var cmt = css.match(/(tempc|pagec)[\S]*css$/)[0]
		Aliyun.getFile(cmt, function(err, result) {
			if (err) return Tools.errHandle('0106', res)
			body.css = result
			++now
			if (now === len) cb(body)
		})
	}
	if (js) {
		var jmt = js.match(/(tempc|pagec)[\S]*js$/)[0]
		Aliyun.getFile(jmt, function(err, result) {
			if (err) return Tools.errHandle('0107', res)
			body.js = result
			++now
			if (now === len) cb(body)
		})
	}
}


module.exports = router
