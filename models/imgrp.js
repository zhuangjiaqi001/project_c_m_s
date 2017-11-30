module.exports = function(sequelize, DataTypes) {
	// 推荐位列表数据
	const ImgRP = sequelize.define('cms_img_rp', {
		id:           { type: DataTypes.BIGINT(11), primaryKey : true, autoIncrement: true, unique : true },
		userId:       {
			type: DataTypes.BIGINT(11),
			comment: '用户ID'
		},
		key:          { type: DataTypes.STRING(100), unique: true,   comment: '推荐位KEY' },
		name:         { type: DataTypes.STRING(100), unique: true,   comment: '推荐位名称' },
		description:  { type: DataTypes.STRING, comment: '描述' },
		custemItems:  { type: DataTypes.STRING, comment: '自定义字段' },
		hash:         { type: DataTypes.STRING, comment: 'KEY对应的HASH' },
		active:       { type: DataTypes.BOOLEAN, defaultValue: false, comment: '是否激活' }
	}, {
		freezeTableName: false
		// freezeTableName: true,
		// tableName: 'cms_img_rp',
		// comment: '图片推荐位',
		// charset: 'utf8',
		// collate: 'utf8_general_ci'
	})

	return ImgRP
}