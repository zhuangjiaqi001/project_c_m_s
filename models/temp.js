module.exports = function(sequelize, DataTypes) {
	// 模板类列表
	const Temp = sequelize.define('cms_temp', {
		id:           { type: DataTypes.BIGINT(11), primaryKey : true, autoIncrement: true, unique : true },
		userId:       {
			type: DataTypes.BIGINT(11),
			comment: '用户ID'
		},
		key:          { type: DataTypes.STRING(100), unique : true,   comment: '模板类KEY' },
		name:         { type: DataTypes.STRING(100), unique : true,   comment: '模板名称' },
		description:  { type: DataTypes.STRING,  comment: '模板描述' }
	}, {
		freezeTableName: false
		// freezeTableName: true,
		// tableName: 'cms_temp',
		// comment: '模板类管理',
		// charset: 'utf8',
		// collate: 'utf8_general_ci'
	})

	// 模板内容
	const Tempc = sequelize.define('cms_temp_c', {
		id:           { type: DataTypes.BIGINT(11), primaryKey : true, autoIncrement: true, unique : true },
		userId:       {
			type: DataTypes.BIGINT(11),
			comment: '用户ID'
		},
		tempId:       {
			type: DataTypes.BIGINT(11),
			comment: '模板类ID'
		},
		key:          { type: DataTypes.STRING(100), unique : true, comment: '模板内容KEY' },
		title:        { type: DataTypes.STRING(100), unique : true, comment: '标题' },
		type:         { type: DataTypes.INTEGER, defaultValue: 0, comment: '模板类型' },		// 0: 模块, 1: 内容
		custemItems:  { type: DataTypes.STRING,  comment: '自定义字段' },
		description:  { type: DataTypes.STRING,  comment: '模板描述' }
	}, {
		freezeTableName: false
		// freezeTableName: true,
		// tableName: 'cms_temp_c',
		// comment: '模板内容',
		// charset: 'utf8',
		// collate: 'utf8_general_ci'
	})

	return {
		Temp: Temp,
		Tempc: Tempc
	}
}