const express = require('express')
const router  = express.Router()
const config  = require('../../config')
const MJJS    = require('../../common/MJJS')
const proxy   = require('../../proxy')
const Img     = proxy.Img
const Aliyun  = require('../../common/aliyun')
const Code    = require('../../common/code')
const Tools   = require('../../common/tools')
const uejson  = require('../../ue.config.js')
const formidable = require('formidable')
const validImg   = require('../../common/validImg')

router.post('/upload', (req, res, next) => {
	var userId = req.signedCookies.id,
		form   = new formidable.IncomingForm()
	form.keepExtensions = true
	form.hash = 'sha1'
	form.uploadDir = config.dir.upload
	MJJS.http.mkdir(form.uploadDir, function() {
		var file,
			len = 0
		form.on('file', function(filed, f) {
			if (f.size) {
				++len
				file = f
			}
		})
		form.parse(req, function(err, fields) {
			if (err)  return Tools.errHandle('0101', res)
			if (!len) return Tools.errHandle('0102', res)
			validImg(1, userId, file, res, function() {
				Aliyun.upload(file, function(err, url) {
					if (err) return Tools.errHandle('0102', res)
					Img.addImage(url, userId, function(err, file) {
						if (err) return Tools.errHandle('0103', res)
						Tools.errHandle('0000', res, {
							id:  file.id,
							url: file.url
						})
					})
				})
			})
		})
	})
})

router.post('/uploadAvatar', (req, res, next) => {
	var id  = req.signedCookies.id*1,
		src = req.body.src

	if (!src) return Tools.errHandle('0114', res)

	Aliyun.uploadBase64(src, function(err, url) {
		if (err) return Tools.errHandle('0112', res)

		Img.addAvatar(url, id, function(err, file) {
			if (err) return Tools.errHandle('0113', res)
			
			Tools.errHandle('0000', res, {
				id:  file.id,
				url: file.url
			})
		})
	})
})

router.use('/ue', (req, res, next) => {
	var q = req.query
	// 图片上传
	if (q.action === 'uploadimage') {
		var id = req.signedCookies.id*1,
			form = new formidable.IncomingForm()
		form.keepExtensions = true
		form.hash = 'sha1'
		form.uploadDir = config.dir.upload
		MJJS.http.mkdir(form.uploadDir, function() {
			var file,
				len = 0
			form.on('file', function(filed, f) {
				if (f.size) {
					++len
					file = f
				}
			})
			form.parse(req, function(err, fields) {
				if (err)  return Tools.errHandle('0101', res)
				if (!len) return Tools.errHandle('0102', res)
				validImg(2, userId, file, res, function() {
					Aliyun.upload(file, function(err, url) {
						if (err) return Tools.errHandle('0102', res)
						Img.addUE(url, id, function(err, file) {
							if (err) return Tools.errHandle('0103', res)
							res.send({
								url: file.url,
								state: 'SUCCESS'
							})
						})
					})
				})
			})
		})
	}
	// 图片列表查询
	else if (q.action === 'listimage') {
		var query = {},
			userId = req.signedCookies.id,
			select = ['url', 'createdAt']
		query.type   = 2
		query.userId = userId
		query.pageSize = q.size
		query.page     = Math.floor(q.start / q.size) + 1
		Img.getImgList(query, select, function (items, pageInfo) {
			res.send({
				state: 'SUCCESS',
				list: JSON.parse(JSON.stringify(items)),
				start: q.start,
				total: pageInfo.total
			})
		})
	}
	// 客户端发起其它请求
	else {
		res.send(JSON.stringify(uejson.ue))
	}
})

module.exports = router