module.exports = function(sequelize, DataTypes) {
	const Img = sequelize.define('cms_img', {
		id:     { type: DataTypes.BIGINT(11), primaryKey : true, autoIncrement: true, unique : true },
		userId:      {
			type: DataTypes.BIGINT(11), 
			comment: '用户ID'
		},
		url:    { type: DataTypes.STRING,  comment: '图片地址' },
		type:   { type: DataTypes.INTEGER, defaultValue: 1, comment: '图片类型' }		// 0: 头像, 1: 图片, 2: 编辑器
	}, {
		freezeTableName: false
		// freezeTableName: true,
		// tableName: 'cms_img',
		// comment: '图片',
		// charset: 'utf8',
		// collate: 'utf8_general_ci'
	})

	return Img
}