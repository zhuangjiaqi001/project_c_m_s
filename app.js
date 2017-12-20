'use strict'

const express      = require('express')
const cookieParser = require('cookie-parser')
const bodyParser   = require('body-parser')
const config       = require('./config')
const routes       = require('./config.routes')
const session      = require('express-session')
const RedisStore   = require('connect-redis')(session)
const swig         = require('swig')
const flash        = require('connect-flash')

// swig默认配置
swig.setDefaults({
	varControls: ['[[', ']]']
})

// 创建项目实例
const app = express()

app.disable('x-powered-by')
// app.set('etag', false)

app.engine('html', swig.renderFile)
app.set('view engine', 'html')
app.set('views', __dirname + config.views)	// 设置views目录
app.set('config', config)

// app.use(logger('dev'))

var redisOpts = {
	port: config.redis.port,
	host: config.redis.host,
	db: 2
}
if (config.redis.password) redisOpts.password = config.redis.password
app.use(session({
	secret: config.cookieSecret + '.secret',
	key: 'cms',
	cookie: { maxAge: config.cookieExpiredTime },
	name: 'mjcms.session',
	resave: true,
	saveUninitialized: true,
	store: new RedisStore(redisOpts)
}))

app.use(flash())

// 定义数据解析器
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }))

// cookie解析
app.use(cookieParser(config.cookieSecret))

app.use(express.static(__dirname + config.static, {
	maxage: 6e5,
	etag: false
}))

app.use(express.static(__dirname + '/demo'))

// 配置路由
routes(app, config)

module.exports = app
