const Tools = require('../common/tools')
module.exports = function(sequelize, DataTypes) {
	// 落地页列表
	const Store = sequelize.define('cms_store', {
		id:           { type: DataTypes.BIGINT(11), primaryKey: true, autoIncrement: true, unique: true },
		userId:       {
			type:    DataTypes.BIGINT(11),
			comment: '用户ID'
		},
		key:          { type: DataTypes.STRING(100), unique: true, comment: '落地页列表KEY' },
		name:         { type: DataTypes.STRING(100), unique: true, comment: '落地页列表名称' },
		description:  { type: DataTypes.STRING, comment: '落地页列表描述' }
	}, {
		freezeTableName: false
	})

	// 落地页内容
	const Storec = sequelize.define('cms_store_c', {
		id:          { type: DataTypes.BIGINT(11), primaryKey : true, autoIncrement: true, unique : true },
		userId:      {
			type: DataTypes.BIGINT(11),
			comment: '用户ID'
		},
		storeId:      {
			type: DataTypes.BIGINT(11),
			comment: '落地页类ID'
		},
		key:         { type: DataTypes.STRING(100), unique : true, comment: '落地页内容KEY' },
		title:       { type: DataTypes.STRING,  comment: '标题' },
		type:        { type: DataTypes.INTEGER, defaultValue: 0, comment: '落地页类型' },		// 0: 模块, 1: 内容
		modelItems:  { type: DataTypes.STRING(1000),  comment: '模块' },
		css:         { type: DataTypes.STRING,  comment: '样式' },
		html:        { type: DataTypes.STRING,  comment: 'HTML文档' },
		js:          { type: DataTypes.STRING,  comment: '脚本' },
		url:         { type: DataTypes.STRING,  comment: '预览' },
		description: { type: DataTypes.STRING,  comment: '落地页描述' },
		active:      { type: DataTypes.BOOLEAN, defaultValue: false, comment: '是否激活' },
		width:       { type: DataTypes.STRING, defaultValue: '1000', comment: '页面宽度' }
	}, {
		freezeTableName: false,
		setterMethods: {
			custemItems: function(val) {
				return this.setDataValue('custemItems', typeof val !== 'string'? JSON.stringify(val): val)
			},
			modelItems: function(val) {
				return this.setDataValue('modelItems', typeof val !== 'string'? JSON.stringify(val): val)
			}
		},
	})

	Store.afterFind(function(val) {
		return Tools.dataToJSON(val)
	})

	Storec.afterFind(function(val) {
		return Tools.dataToJSON(val)
	})

	return {
		Store:  Store,
		Storec: Storec
	}
}