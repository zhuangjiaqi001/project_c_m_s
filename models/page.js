const Tools = require('../common/tools')
module.exports = function(sequelize, DataTypes) {
	// 落地页列表
	const Page = sequelize.define('cms_page', {
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
	const Pagec = sequelize.define('cms_page_c', {
		id:          { type: DataTypes.BIGINT(11), primaryKey : true, autoIncrement: true, unique : true },
		userId:      { type: DataTypes.BIGINT(11), comment: '用户ID' },
		pageId:      { type: DataTypes.BIGINT(11), comment: '落地页类ID' },
		key:         { type: DataTypes.STRING(100), unique : true, comment: '落地页内容KEY' },
		title:       { type: DataTypes.STRING,  comment: '标题' },
		header:      { type: DataTypes.STRING,  comment: '头部' },
		footer:      { type: DataTypes.STRING,  comment: '底部' },
		modelItems:  { type: DataTypes.STRING(1000),  comment: '模块' },
		custemItems: { type: DataTypes.STRING(1000),  comment: '工具库' },
		css:         { type: DataTypes.STRING,  comment: '样式' },
		html:        { type: DataTypes.STRING,  comment: 'HTML文档' },
		js:          { type: DataTypes.STRING,  comment: '脚本' },
		url:         { type: DataTypes.STRING,  comment: '预览' },
		active:      { type: DataTypes.BOOLEAN, defaultValue: false, comment: '是否激活' },
		width:       { type: DataTypes.STRING, defaultValue: '1000', comment: '页面宽度' }
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

	Page.afterFind(function(val) {
		return Tools.dataToJSON(val)
	})

	Pagec.afterFind(function(val) {
		return Tools.dataToJSON(val)
	})

	return {
		Page:  Page,
		Pagec: Pagec
	}
}