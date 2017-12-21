const Tools = require('../common/tools')
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
		title:        { type: DataTypes.STRING,  comment: '标题' },
		type:         { type: DataTypes.INTEGER, defaultValue: 0, comment: '模板类型' },		// 0: 模块, 1: 内容
		custemItems:  { type: DataTypes.STRING(1000),  comment: '工具库' },
		css:          { type: DataTypes.STRING,  comment: '样式' },
		html:         { type: DataTypes.STRING,  comment: 'HTML文档' },
		js:           { type: DataTypes.STRING,  comment: '脚本' },
	}, {
		freezeTableName: false,
		setterMethods: {
			custemItems: function(val) {
				return this.setDataValue('custemItems', typeof val !== 'string'? JSON.stringify(val): val)
			}
		},
	})

	Temp.afterFind(function(val) {
		return Tools.dataToJSON(val)
	})
	Tempc.afterFind(function(val) {
		return Tools.dataToJSON(val)
	})
	
	return {
		Temp: Temp,
		Tempc: Tempc
	}
}