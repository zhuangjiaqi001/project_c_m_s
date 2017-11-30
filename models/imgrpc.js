module.exports = function(sequelize, DataTypes) {
	// 推荐位内容列表数据
	const ImgRPC = sequelize.define('cms_img_rpc', {
		id:           { type: DataTypes.BIGINT(11), primaryKey : true, autoIncrement: true, unique : true },
		userId:       {
			type: DataTypes.BIGINT(11),
			comment: '用户ID'
		},
		rpId:         {
			type: DataTypes.BIGINT(11),
			comment: '推荐位ID'
		},
		key:          {
			type: DataTypes.STRING,
			comment: '推荐位KEY'
		},

		title:        { type: DataTypes.STRING, comment: '标题' },
		imageUrl:     { type: DataTypes.STRING, comment: '图片地址' },
		url:          { type: DataTypes.STRING, comment: '链接地址' },
		startTime:    { type: DataTypes.STRING, comment: '开始时间' },
		endTime:      { type: DataTypes.STRING, comment: '结束时间' },
		custemItems:  { type: DataTypes.STRING,   comment: '自定义字段' }
	}, {
		freezeTableName: false
		// freezeTableName: true,
		// tableName: 'cms_img_rpc',
		// comment: '图片推荐位信息',
		// charset: 'utf8',
		// collate: 'utf8_general_ci',
	})

	return ImgRPC
}