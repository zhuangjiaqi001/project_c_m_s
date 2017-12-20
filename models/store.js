const Tools = require('../common/tools')
module.exports = function(sequelize, DataTypes) {
	// 商店列表
	const Store = sequelize.define('cms_store', {
		id:           { type: DataTypes.BIGINT(11), primaryKey: true, autoIncrement: true, unique: true },
		userId:       {
			type:    DataTypes.BIGINT(11),
			comment: '用户ID'
		},
		key:          { type: DataTypes.STRING(100), unique: true, comment: '商店列表KEY' },
		name:         { type: DataTypes.STRING(100), unique: true, comment: '商店列表名称' },
		description:  { type: DataTypes.STRING, comment: '商店列表描述' }
	}, {
		freezeTableName: false
	})

	// 商店内容
	const Storec = sequelize.define('cms_store_c', {
		id:          { type: DataTypes.BIGINT(11), primaryKey : true, autoIncrement: true, unique : true },
		userId:      { type: DataTypes.BIGINT(11), comment: '用户ID' },
		stopId:      { type: DataTypes.BIGINT(11), comment: '店铺ID' },
		storeId:     { type: DataTypes.BIGINT(11), comment: '商店ID' },
		key:         { type: DataTypes.STRING(100), unique : true, comment: '商店内容KEY' },
		title:       { type: DataTypes.STRING,  comment: '标题' },
		url:         { type: DataTypes.STRING,  comment: '链接' },
		html:        { type: DataTypes.STRING,  comment: 'HTML' },
		json:        { type: DataTypes.STRING,  comment: 'JSON' },
		active:      { type: DataTypes.BOOLEAN, defaultValue: false, comment: '是否激活' }
	}, {
		freezeTableName: false,
		getterMethods: {
			json: function() {
				this
				debugger
			}
		},
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