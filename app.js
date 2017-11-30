'use strict'

const express      = require('express')
const logger       = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser   = require('body-parser')
const config       = require('./config')
const routes       = require('./config.routes')
const session      = require('express-session')
const RedisStore   = require('connect-redis')(session)
const swig         = require('swig')
const flash        = require('connect-flash')
const os           = require('os')

// swig默认配置
swig.setDefaults({
	varControls: ['[[', ']]']
})

// 创建项目实例
const app = express()

app.disable('x-powered-by')
app.set('etag', false)

app.engine('html', swig.renderFile)
app.set('view engine', 'html')
app.set('views', __dirname + config.views)	// 设置views目录
app.set('config', config)

// app.use(logger('dev'))

app.use(session({
	secret: config.cookieSecret + '.secret',
	key: 'cms',
	cookie: { maxAge: config.cookieExpiredTime },
	name: 'mjcms.session',
	resave: true,
	saveUninitialized: true,
	store: new RedisStore({
		port: config.redis.port,
		host: config.redis.host
	})
}))

// 定义数据解析器
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// cookie解析]
app.use(cookieParser(config.cookieSecret))

app.use(flash())


const oneDay = 86400000
app.use(express.static(__dirname + config.static, { maxAge: oneDay }))

// 添加字段处理时间(ms)
app.use(function (req, res, next) {
	var startTime = Date.now()
	var _send = res.send
	res.send = function () {
		res.set('Z-Execution-Time', String(Date.now() - startTime + 'ms'))
		return _send.apply(res, arguments)
	}
	next()
})

// 渲染统一添加config
app.use(function (req, res, next) {
	var _render = res.render
	res.render = function () {
		arguments[1].config = config
		return _render.apply(this, arguments)
	}
	next()
})

// 配置路由
routes(app)

module.exports = app
