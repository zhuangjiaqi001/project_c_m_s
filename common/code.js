module.exports = {
	'0000': '成功!',
	// 0001-0020: 获取用户信息相关错误
	'0001': '用户信息失效!',
	'0002': '用户信息不完整!',
	'0003': '用户名或密码不存在!',
	'0005': '登录失败!',			// redis写入失败
	'0006': '用户信息失效, 请重新登录!',
	'0010': '获取用户列表失败!',
	'0011': '获取用户信息失败!',
	// 0021-0040: 用户注册相关错误
	'0021': '用户信息不完整!',
	'0022': '用户名不正确!',
	'0023': '用户密码不正确!',
	'0024': '两次输入的密码不一致!',
	'0025': '邮箱不合法!',
	'0026': '用户名或邮箱已被使用!',
	'0027': '注册失败!',
	// 0041-0060: 用户更新相关错误
	'0041': '修改信息不存在!',
	'0042': '修改信息失败!',		// 数据库失败
	'0043': '您无权限修改该等级用户的信息!',
	'0044': '修改信息失败!',		// Redis操作失败
	// 0101-0110: 文件相关错误
	'0101': '文件上传失败!',		// node失败
	'0102': '文件上传失败!',		// aliyun失败
	'0103': '文件上传失败!',		// 数据库失败
	'0104': '文件未上传!',
	'0105': '文件获取失败!',
	'0106': '文件获取失败!',
	'0107': '文件获取失败!',
	'0112': '图片上传失败!',		// aliyun失败
	'0113': '图片上传失败!',		// 数据库失败
	'0114': '图片未上传!',
	'0115': '文件上传失败!',		// aliyun失败(html)
	'0116': '文件上传失败!',		// aliyun失败(css)
	'0117': '文件上传失败!',		// aliyun失败(js)
	'0118': '文件上传失败!',		// aliyun失败(prev)

	// 0121-0140: 推荐位
	'0121': '推荐位KEY值不能为空!',
	'0122': '推荐位名称不能为空!',
	'0123': '推荐位KEY值或名称已被使用!',
	'0124': '推荐位创建失败!',				// 数据库失败
	'0125': '获取推荐位列表失败!',			// 数据库失败
	'0126': '推荐位ID不存在!',
	'0127': '获取推荐位失败!',				// 数据库失败
	'0128': '推荐位不存在!',
	'0129': '推荐位数据创建不存在!',		// 数据库失败
	'0130': '修改推荐位失败!',				// 数据库失败
	'0131': '不超过30个字!',
	'0132': '标题不能为空!',
	'0133': '删除推荐位失败!',				// 数据库失败
	'0134': '发布状态下不能删除推荐位!',


	'0141': '获取推荐位失败!',				// 数据库失败(API)
	'0142': '发布推荐位失败!',
	'0143': '发布推荐位失败!',				// 激活失败

	'9999': '数据异常!'
};