module.exports = function(sequelize, DataTypes) {
	const User = sequelize.define('cms_users', {
		id:           { type: DataTypes.BIGINT(11), primaryKey : true, autoIncrement: true, unique : true },
		loginname:    { type: DataTypes.STRING(100), unique : true, comment: '登录名' },
		nickname:     { type: DataTypes.STRING, comment: '昵称' },
		password:     { type: DataTypes.STRING, comment: '密码' },
		email:        { type: DataTypes.STRING(100), unique : true, comment: '登录名' },
		mobile:       { type: DataTypes.STRING, comment: '手机' },
		gender:       { type: DataTypes.STRING, defaultValue: '',   comment: '性别' },
		birthday:     { type: DataTypes.STRING, comment: '生日' },
		zodiac:       { type: DataTypes.STRING, comment: '星座' },
		zodiac_china: { type: DataTypes.STRING, comment: '属相' },
		blood_type:   { type: DataTypes.STRING, defaultValue: '',   comment: '血型' },
		url:          { type: DataTypes.STRING, comment: '个人主页' },
		location:     { type: DataTypes.STRING, comment: '地区' },
		signature:    { type: DataTypes.STRING, comment: '签名' },
		description:  { type: DataTypes.STRING, comment: '个人描述' },
		avatar:       { type: DataTypes.STRING, comment: '头像' },

		level:        { type: DataTypes.INTEGER, defaultValue: 0,     comment: '等级' },
		levelName:    { type: DataTypes.STRING,  defaultValue: '蝼蚁', comment: '等级名称' },
		freeze:       { type: DataTypes.BOOLEAN, defaultValue: false, comment: '账号冻结' },
		accessToken:  { type: DataTypes.STRING,  comment: 'token' }
	}, {
		freezeTableName: false
		// freezeTableName: true,
		// tableName: 'cms_users',
		// comment: '用户',
		// charset: 'utf8',
		// collate: 'utf8_general_ci'
	})

	return User
}