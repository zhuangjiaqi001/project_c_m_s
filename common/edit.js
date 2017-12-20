module.exports = {
	User: {
		nickname:     1,		// 昵称
		password:     1,		// 密码
		email:        1,		// 邮箱
		gender:       1,		// 性别
		birthday:     1,		// 生日
		zodiac:       1,		// 星座
		zodiac_china: 1,		// 属相
		blood_type:   1,		// 血型
		url:          1,		// 个人主页
		location:     1,		// 地区
		signature:    1,		// 签名
		description:  1,		// 个人描述
		avatar:       1			// 头像
	},
	ImgRP: {
		name:        1,			// 名称
		description: 1,			// 描述
		custemItems: 1			// 自定义属性
	},
	ImgRPC: {
		title:       1,			// 标题
		imageUrl:    1,			// 图片
		url:         1, 		// 链接
		startTime:   1, 		// 开始时间
		endTime:     1,			// 结束时间
		custemItems: 1			// 自定义属性
	},
	TxtRP: {
		name:        1,			// 名称
		description: 1,			// 描述
		custemItems: 1			// 自定义属性
	},
	TxtRPC: {
		title:       1,			// 标题
		url:         1, 		// 链接
		startTime:   1, 		// 开始时间
		endTime:     1,			// 结束时间
		custemItems: 1			// 自定义属性
	},
	Temp: {
		name:        1,			// 名称
		description: 1,			// 描述
	},
	TempC: {
		title:       1,			// 标题
		html:        1, 		// HTML
		css:         1, 		// CSS
		js:          1, 		// JS
		custemItems: 1			// 工具库
	},
	Shop: {
		name:        1,			// 名称
		description: 1,			// 描述
	},
	ShopC: {
		title:       1,			// 标题
		html:        1, 		// HTML
		css:         1, 		// CSS
		js:          1, 		// JS
		json:        1,
		header:      1,
		footer:      1,
		custemItems: 1,			// 工具库
		modelItems:  1,
	},
	Page: {
		name:        1,			// 名称
		description: 1,			// 描述
	},
	PageC: {
		title:       1,			// 标题
		url:         1, 		// 链接
		custemItems: 1,
		header:      1,
		footer:      1,
		width:       1,
		modelItems:  1,
	},
}