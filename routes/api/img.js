const express = require('express')
const router  = express.Router()
const config  = require('../../config')
const proxy   = require('../../proxy')
const Img     = proxy.Img
const Tools   = require('../../common/tools')


// 获取推荐位列表
router.get('/list', (req, res, next) => {
	var query  = req.query,
		userId = req.signedCookies.id,
		select = ['url', 'createdAt']
	query.type   = query.type || 1
	query.userId = userId
	Img.getImgList(query, select, function (items, pageInfo) {
		Tools.errHandle('0000', res, {
			list: items,
			pageInfo: pageInfo
		})
	})
})

module.exports = router