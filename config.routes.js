module.exports = function(app) {
	// 用户相关
	app.use('/register', require('./routes/register'))	// 注册
	app.use('/logout',   require('./routes/logout'))	// 登出


	// 校验
	app.use([
		'/dashboard',
		'/user',
		'/permit',
		'/imgrp',
		'/txtrp',
		'/temp',
		'/page'
	], require('./routes/cookie'))


	// 页面
	app.use('/',          require('./routes/index'))		// 首页登录注册
	app.use('/dashboard', require('./routes/dashboard'))	// 仪表板 (总体数据)
	app.use('/user',      require('./routes/user'))			// 用户管理
	// app.use('/permit',    require('./routes/permit'))		// 权限管理
	app.use('/imgrp',     require('./routes/imgrp'))		// 图片推荐位
	app.use('/txtrp',     require('./routes/txtrp'))		// 文字推荐位
	app.use('/temp',      require('./routes/temp'))			// 模板管理
	app.use('/page',      require('./routes/page'))			// 页面管理


	// API
	app.use('/api', require('./routes/api'))	// 平台API
	app.use('/apig', require('./routes/apig'))	// API获取


	// 404 catch-all 处理器 & 500 错误处理器
	app.use(require('./routes/ERROR404'))
	app.use(require('./routes/ERROR500'))
}
