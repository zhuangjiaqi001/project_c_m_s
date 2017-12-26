const co        = require('co')
const Sequelize = require('sequelize')
const config    = require('../config')
const mysql     = config.mysql

const sequelize = new Sequelize(mysql.database, mysql.user, mysql.pass, mysql.opts)

const User   = require('./user')(sequelize, Sequelize)		// 用户管理
const Img    = require('./img')(sequelize, Sequelize)		// 图片
// 推荐位管理
const ImgRP  = require('./imgrp')(sequelize, Sequelize)
const ImgRPC = require('./imgrpc')(sequelize, Sequelize)
const TxtRP  = require('./txtrp')(sequelize, Sequelize)
const TxtRPC = require('./txtrpc')(sequelize, Sequelize)
// 模块管理
const Tp     = require('./temp')(sequelize, Sequelize)
const Temp   = Tp.Temp
const TempC  = Tp.Tempc
// 落地页管理
const Pg     = require('./page')(sequelize, Sequelize)
const Page   = Pg.Page
const PageC  = Pg.Pagec
// 店铺模板管理
const Sp     = require('./shop')(sequelize, Sequelize)
const Shop   = Sp.Shop
const ShopC  = Sp.Shopc
// 店铺页管理
const St     = require('./store')(sequelize, Sequelize)
const Store  = St.Store
const StoreC = St.Storec
// 日志管理
const Log    = require('./log')(sequelize, Sequelize)


// 关联关系
// 图片推荐位
User.hasMany(ImgRP,   { foreignKey: 'userId', targetKey: 'id', as: 'ImgRP' })	// 用户关联推荐位列表
// User.hasMany(ImgRPC,  { foreignKey: 'userId', targetKey: 'id', as: 'ImgRPC' })	// 用户关联推荐位内容
User.hasMany(Img,     { foreignKey: 'userId', targetKey: 'id', as: 'Img' })		// 用户关联图片
ImgRP.hasMany(ImgRPC, { foreignKey: 'rpId',   targetKey: 'id', as: 'rps' })	// 推荐位关联内容

// 文字推荐位
User.hasMany(TxtRP,   { foreignKey: 'userId', targetKey: 'id', as: 'TxtRP' })	// 用户关联推荐位列表
// User.hasMany(TxtRPC,  { foreignKey: 'userId', targetKey: 'id', as: 'TxtRPC' })	// 用户关联推荐位内容
TxtRP.hasMany(TxtRPC, { foreignKey: 'rpId',   targetKey: 'id', as: 'rps' })	// 推荐位关联内容

// 模板管理
User.hasMany(Temp,   { foreignKey: 'userId', targetKey: 'id', as: 'Temp' })		// 用户关联模板列表类
// User.hasMany(TempC,  { foreignKey: 'userId', targetKey: 'id', as: 'TempC' })	// 用户关联模板内容
Temp.hasMany(TempC,  { foreignKey: 'tempId', targetKey: 'id', as: 'temps' })	// 模板类关联内容

// 落地页管理
User.hasMany(Page,   { foreignKey: 'userId', targetKey: 'id', as: 'Page' })		// 用户关联落地页列表类
// User.hasMany(PageC,  { foreignKey: 'userId', targetKey: 'id', as: 'PageC' })	// 用户关联落地页内容
Page.hasMany(PageC,  { foreignKey: 'pageId', targetKey: 'id', as: 'pages' })	// 列表类关联内容

// 商店管理
User.hasMany(Store,   { foreignKey: 'userId', targetKey: 'id', as: 'Store' })	// 用户关联店铺列表类
// User.hasMany(StoreC,  { foreignKey: 'userId', targetKey: 'id', as: 'StoreC' })	// 用户关联店铺内容
Store.hasMany(StoreC, { foreignKey: 'storeId', targetKey: 'id', as: 'stores' })	// 列表类关联内容

// 店铺装修管理
User.hasMany(Shop,    { foreignKey: 'userId', targetKey: 'id', as: 'Shop' })	// 用户关联店铺列表类
// User.hasMany(ShopC,   { foreignKey: 'userId', targetKey: 'id', as: 'ShopC' })	// 用户关联店铺内容
Shop.hasMany(ShopC,   { foreignKey: 'shopId', targetKey: 'id', as: 'shops' })	// 列表类关联内容
ShopC.hasMany(StoreC, { foreignKey: 'shopcId', targetKey: 'id', as: 'stores' })	// 列表类关联内容

// 日志管理
// User.hasMany(Log,   { foreignKey: 'userId', targetKey: 'id', as: 'Log' })
// User.belongsTo(Log, { foreignKey: 'id', targetKey: 'userId',   as: 'log' })

sequelize.sync()

// Log.hasOne(User,    { foreignKey: 'id', targetKey: 'userId',   as: 'user' })
// Log.hasOne(Img,     { foreignKey: 'id', targetKey: 'imgId',    as: 'img' })
// Log.hasOne(ImgRP,   { foreignKey: 'id', targetKey: 'imgrpId',  as: 'imgrp' })
// Log.hasOne(ImgRPC,  { foreignKey: 'id', targetKey: 'imgrpcId', as: 'imgrpc' })
// Log.hasOne(TxtRP,   { foreignKey: 'id', targetKey: 'txtrpId',  as: 'txtrp' })
// Log.hasOne(TxtRPC,  { foreignKey: 'id', targetKey: 'txtrpcId', as: 'txtrpc' })
// Log.hasOne(Temp,    { foreignKey: 'id', targetKey: 'tempId',   as: 'temp' })
// Log.hasOne(TempC,   { foreignKey: 'id', targetKey: 'tempcId',  as: 'tempc' })
// Log.hasOne(Page,    { foreignKey: 'id', targetKey: 'pageId',   as: 'page' })
// Log.hasOne(PageC,   { foreignKey: 'id', targetKey: 'pagecId',  as: 'pagec' })
// Log.hasOne(Shop,    { foreignKey: 'id', targetKey: 'shopId',   as: 'shop' })
// Log.hasOne(ShopC,   { foreignKey: 'id', targetKey: 'shopcId',  as: 'shopc' })
// Log.hasOne(Store,   { foreignKey: 'id', targetKey: 'storeId',  as: 'store' })
// Log.hasOne(StoreC,  { foreignKey: 'id', targetKey: 'storecId', as: 'storec' })

exports.User   = User
exports.Img    = Img
exports.ImgRP  = ImgRP
exports.ImgRPC = ImgRPC
exports.TxtRP  = TxtRP
exports.TxtRPC = TxtRPC
exports.Temp   = Temp
exports.TempC  = TempC
exports.Page   = Page
exports.PageC  = PageC
exports.Shop   = Shop
exports.ShopC  = ShopC
exports.Store  = Store
exports.StoreC = StoreC
exports.Log    = Log
