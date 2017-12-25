const Tools = require('../common/tools')
module.exports = function(sequelize, DataTypes) {
	// 店铺装修列表
	const Shop = sequelize.define('cms_shop', {
		id:          { type: DataTypes.BIGINT(11), primaryKey: true, autoIncrement: true, unique: true },
		userId:      {
			type:    DataTypes.BIGINT(11),
			comment: '用户ID'
		},
		key:         { type: DataTypes.STRING(100), unique: true, comment: '店铺装修KEY' },
		name:        { type: DataTypes.STRING(100), unique: true, comment: '店铺装修名称' },
		description: { type: DataTypes.STRING,  comment: '店铺装修描述' }
	}, {
		freezeTableName: false
	})

	// 商店内容
	const Shopc = sequelize.define('cms_shop_c', {
		id:          { type: DataTypes.BIGINT(11), primaryKey: true, autoIncrement: true, unique: true },
		userId:      {
			type:    DataTypes.BIGINT(11),
			comment: '用户ID'
		},
		shopId:      {
			type:    DataTypes.BIGINT(11),
			comment: '店铺装修ID'
		},
		key:         { type: DataTypes.STRING(100), unique: true, comment: '商店内容KEY' },
		title:       { type: DataTypes.STRING, comment: '标题' },
		header:      { type: DataTypes.STRING, comment: '头部' },
		footer:      { type: DataTypes.STRING, comment: '底部' },
		modelItems:  { type: DataTypes.STRING(1000), comment: '模块' },
		custemItems: { type: DataTypes.STRING(1000), comment: '工具库' },
		css:         { type: DataTypes.STRING, comment: '样式' },
		html:        { type: DataTypes.STRING, comment: 'HTML文档' },
		js:          { type: DataTypes.STRING, comment: '脚本' },
		json:        { type: DataTypes.STRING(1000), comment: '脚本' },
		preview:     { type: DataTypes.STRING, comment: '预览' },
		description: { type: DataTypes.STRING, comment: '商店描述' }
	}, {
		freezeTableName: false,
		setterMethods: {
			custemItems: function(val) {
				return this.setDataValue('custemItems', typeof val !== 'string'? JSON.stringify(val): val)
			},
			modelItems: function(val) {
				val = val == null? '[]': val
				if (typeof val !== 'string') {
					var mod = []
					val.map(function(i) { mod.push(typeof i === 'string'? i: i.id) })
					val = JSON.stringify(Tools.unique(mod))
				}
				return this.setDataValue('modelItems', val)
			},
			header: function(val) {
				return this.setDataValue('header', val? val.id: '')
			},
			footer: function(val) {
				return this.setDataValue('footer', val? val.id: '')
			},
		},
	})

	Shop.afterFind(function(val) {
		return Tools.dataToJSON(val)
	})
	Shopc.afterFind(function(val) {
		return Tools.dataToJSON(val)
	})
	
	return {
		Shop: Shop,
		Shopc: Shopc
	}
}