const moment  = require('moment')
const crypto  = require('crypto')
const Code    = require('./code')
const config  = require('../config')
const Mapping = require('./mapping')

var Public

moment.locale('zh-cn'); // 使用中文

var RP = {
	pn: /\S+cms\/[a-z]{2}\//
}

var Tools = {
	formatDate: function (date, friendly) {
		date = moment(date);

		if (friendly) {
			return date.fromNow();
		} else {
			return date.format('YYYY-MM-DD HH:mm:ss');
		}
	},
	// 密钥哈希
	hmac: function(str) {
		return crypto.createHmac('sha256', config.passSecret).update(str).digest('hex')
	},
	// base64
	base64: function(str) {
		return crypto.createHmac('sha256', config.passSecret).update(str).digest('base64')
	},
	// 判断 value值 是否在 数组内
	inArray: function(val, arr) {
		var flag = 0;
		for (var i = 0, l = arr.length; i < l; i++) {
			if (val === arr[i]) {
				flag = 1;
				break;
			}
		}
		return flag;
	},
	// 根据生日计算星座&生肖
	getAstro: function (dateStr) {
		var sp = dateStr.match(/\d{1,2}/g);
		return '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'.substr(sp[2]*2-(sp[3]<'102223444433'[sp[2]-1]- -19)*2,2) + '座';
	},
	getZodiacChina: function(dateStr) {
		var x = (1901 - dateStr.match(/\d{4}/g)) % 12,
			v = '牛';
		if (x == 1  || x == -11) v = '鼠'
		if (x == 11 || x == -1)  v = '虎'
		if (x == 10 || x == -2)  v = '兔'
		if (x == 9  || x == -3)  v = '龙'
		if (x == 8  || x == -4)  v = '蛇'
		if (x == 7  || x == -5)  v = '马'
		if (x == 6  || x == -6)  v = '羊'
		if (x == 5  || x == -7)  v = '猴'
		if (x == 4  || x == -8)  v = '鸡'
		if (x == 3  || x == -9)  v = '狗'
		if (x == 2  || x == -10) v = '猪'
		return v;
	},
	// 查询数据库时的数据过滤
	querySearch: function(query, select) {
		var order  = Tools.sort(query.sort),
			limit  = ~~(query.pageSize) || 10,
			page   = query.page? query.page - 1: 0,
			offset = page * limit,
			where  = Tools.searchFilter(query, ['page', 'pageSize', 'sort'])
			select.push('id')
		return {
			opts: {
				where:  where,
				select: select,
				order:  order,
				limit:  limit,
				offset: offset,
				attributes:  select
			},
			page: page + 1
		}
	},
	// 排序
	sort: function(str) {
		if (str) {
			var obj = [[str.replace('-', ''), (/\-/.test(str)? 'DESC': 'ASC')]]
			return obj
		} else {
			return [['createdAt', 'DESC']]
		}
	},
	// where
	searchFilter: function(obj, filterArr) {
		filterArr.map((_) => {
			delete obj[_]
		})
		for (var p in obj) {
			var v = obj[p]
			if (/^\$/.test(p)) {
				var q = p.substr(1)
				obj[q] = v
				delete obj[p]
			} else {
				obj[p] = { '$like': '%' + v + '%' }
			}
		}
		return obj
	},
	// 去除 无权修改的字段&空值字段 (去除ID)
	bodyFilter: function(permit, oObj) {
		var l = 0
		var nObj = {}
		for (var p in oObj) {
			if (permit[p]) {
				++l
				var val = typeof oObj[p] === 'string'? oObj[p].replace(/(^\s*)|(\s*$)/g, ''): oObj[p]
				if (val !== null) nObj[p] = val
			}
		}
		delete nObj.id
		return {
			obj: nObj,
			length: l
		}
	},
	dataFilter: function(data, array) {
		var len = array.length
		if (!len) return data
		var nData = {}
		array.map((i, _i) => {
			if(data[i] != null) nData[i] = data[i]
		})
		return nData
	},
	// 权限限制页面
	permit: function(title, res) {
		res.render('ERROR_PERMIT', { title: title })
	},
	// 将原始对象的字段赋予新对象
	// nowObj: 被赋值的对象
	// orgObj: 赋值的对象
	// select: 赋值的字段
	objFilter: function(nowObj, orgObj, select) {
		for (var v of select) {
			if (orgObj[v]) nowObj[v] = orgObj[v];
		}
		return nowObj;
	},
	// 错误处理
	errHandle: function(code, res, data) {
		var me = this
		code = Code[code]? code: '9999'
		if (code === '0000') {
			if (!Public) Public = require('./public')
			Public.set.log(res.req, function() {
				res.send(me.sendHandle(code, data))
			})
		} else {
			res.send(me.sendHandle(code, data))
		}
	},
	sendHandle: function(code, data) {
		code = Code[code]? code: '9999'
		return {
			code: code,
			data: data || null,
			message: Code[code]
		}
	},
	errFlash: function(req, res, name, code, url) {
		req.flash(name, Code[code])
		if (url) res.redirect(url)
	},
	// 日期格式转换
	dateToStr: function(items) {
		var me = this
		var da = []
		for (var item of items) {
			item = item.dataValues
			if (item.createdAt) item.createdAt = me.formatDate(item.createdAt)
			if (item.updatedAt) item.updatedAt = me.formatDate(item.updatedAt)
			if (item.startTime) item.startTime = me.formatDate(item.startTime)
			if (item.endTime)   item.endTime   = me.formatDate(item.endTime)
			if (item.levelName) item.levelName = Mapping.level[item.level] || Mapping.level[0]
			// if (item.custemItems) item.custemItems = JSON.parse(item.custemItems)
			da.push(item)
		}
		return da
	},
	redisDB: function(db) {
		var cfg = JSON.parse(JSON.stringify(config.redis))
		cfg.db = db || 1
		return cfg
	},
	getJSFrame: function() {
		return Mapping.jsframe
	},
	unique: function(array) {
		var res = [], json = {}
		for(var i = 0, l = array.length; i < l; i++) {
			if(!json[array[i]]) {
				res.push(array[i])
				json[array[i]] = 1
			}
		}
		return res
	},
	getTempById: function(body, cb) {
		var ids = []
		if (body.modelItems) {
			ids = JSON.parse(JSON.stringify(body.modelItems))
		}
		if (body.header) ids.push(body.header)
		if (body.footer) ids.push(body.footer)

		cb && cb(Tools.unique(ids), body)
	},
	__getClass: function(obj) {
		return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1]
	},
	dataToJSON: function(data) {
		var type = this.__getClass(data)
		if (type === 'Object') {
			return objToJSON(data)
		} else if (type === 'Array') {
			data.map((i, _i) => {
				data[_i] = objToJSON(i)
			})
			return data
		}
	},
}

function objToJSON(obj) {
	var da = obj.dataValues
	if (da.custemItems) da.custemItems = JSON.parse(da.custemItems)
	if (da.modelItems)  da.modelItems  = JSON.parse(da.modelItems)
	if (da.header)    da.header    = JSON.parse(da.header)
	if (da.footer)    da.footer    = JSON.parse(da.footer)
	if (da.createdAt) da.createdAt = Tools.formatDate(da.createdAt)
	if (da.updatedAt) da.updatedAt = Tools.formatDate(da.updatedAt)
	if (da.startTime) da.startTime = Tools.formatDate(da.startTime)
	if (da.endTime)   da.endTime   = Tools.formatDate(da.endTime)
	if (da.levelName) da.levelName = Mapping.level[da.level] || Mapping.level[0]
	return da
}

module.exports = Tools

