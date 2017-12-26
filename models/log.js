const Tools = require('../common/tools')
module.exports = function(sequelize, DataTypes) {
	// 操作日志
	const Log = sequelize.define('cms_log', {
		id:        { type: DataTypes.BIGINT(11), primaryKey : true, autoIncrement: true, unique : true },
		type:      { type: DataTypes.STRING, comment: '指令类型' },
		directive: { type: DataTypes.STRING, comment: '执行指令' },
		loginname: { type: DataTypes.STRING },
		desc:      { type: DataTypes.STRING(1000), defaultValue: '' },
	}, {
		freezeTableName: false,
	})

	Log.afterFind(function(val) {
		return Tools.dataToJSON(val)
	})

	return Log
}