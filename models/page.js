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
		// freezeTableName: true,
		// tableName: 'cms_page',
		// comment: '落地页列表管理',
		// charset: 'utf8',
		// collate: 'utf8_general_ci'
	})

	// 落地页内容
	const Pagec = sequelize.define('cms_page_c', {
		id:          { type: DataTypes.BIGINT(11), primaryKey : true, autoIncrement: true, unique : true },
		userId:      {
			type: DataTypes.BIGINT(11),
			comment: '用户ID'
		},
		pageId:      {
			type: DataTypes.BIGINT(11),
			comment: '落地页类ID'
		},
		key:         { type: DataTypes.STRING(100), unique : true, comment: '落地页内容KEY' },
		title:       { type: DataTypes.STRING(100), unique : true, comment: '标题' },
		type:        { type: DataTypes.INTEGER, defaultValue: 0, comment: '落地页类型' },		// 0: 模块, 1: 内容
		header:      { type: DataTypes.STRING,  comment: '头部' },
		footer:      { type: DataTypes.STRING,  comment: '底部' },
		modelItems:  { type: DataTypes.STRING,  comment: '模块' },
		custemItems: { type: DataTypes.STRING,  comment: '工具库' },
		css:         { type: DataTypes.STRING,  comment: '样式' },
		html:        { type: DataTypes.STRING,  comment: 'HTML文档' },
		js:          { type: DataTypes.STRING,  comment: '脚本' },
		url:         { type: DataTypes.STRING,  comment: '预览' },
		description: { type: DataTypes.STRING,  comment: '落地页描述' },
		active:      { type: DataTypes.BOOLEAN, defaultValue: false, comment: '是否激活' },
		width:       { type: DataTypes.STRING, defaultValue: '1000', comment: '页面宽度' }
	}, {
		freezeTableName: false
		// freezeTableName: true,
		// tableName: 'cms_page_c',
		// comment: '落地页内容',
		// charset: 'utf8',
		// collate: 'utf8_general_ci'
	})

	return {
		Page:  Page,
		Pagec: Pagec
	}
}