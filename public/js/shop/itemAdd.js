(function(global, VM, CMS) {
	var API = {
		templist:	'/temp/getTempList',
		tempclist:	'/temp/getTempCList',
		get:    '/shop/get',
		getC:   '/shop/getC',
		submit: '/shop/addShopC'
	},
	shopId = CMS.getQueryValue('shopId'),
	id   = CMS.getQueryValue('id');

	global.handleCSel = function(item) {
		VUE.handleCSel(item)
	}
	global.selModel = function(item) {
		VUE.selModel(item)
	}
	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			listAPI: API.templist,
			columns: [
				{
					title: '名称',
					key: 'name',
					render: (row, col, idx) => {
						return `<span>${row.name || row.title}</span>`
					}
				},
				{
					title: '描述',
					render: (row, col, idx) => {
						return `<span>${row.description || ''}</span>`
					}
				},
				{
					title: '操作',
					key: '',
					render: (row, col, idx) => {
						if (VUE.isTempC) return `<a class="text-blue" @click="selModel(row)">选择</i></a>`
						else return `<a class="text-blue" @click="handleCSel(row)">详情</i></a>`
					}
				}
			],
			shop: {},
			formValidate: {
				shopId:      shopId || '',
				id:          id     || '',
				name:        '',
				description: '',
				modelItems:  [],
				title:       '',
				html:        '',
				css:         '',
				js:          '',
				json:        '',
				header:      {},
				footer:      {},
			},
			ruleValidate: {
				title: [
					{ required: true, message: '标题不能为空', trigger: 'blur' },
					{ type: 'string', min: 1, max: 30, message: '不超过30个字', trigger: 'blur' }
				]
			},
			pageTemp: {
				total: 0,
				pageSize: 10,
				current: 1,
				dataList: []
			},
			pageTempC: {
				total: 0,
				pageSize: 10,
				current: 1,
				dataList: [],
				search: {}
			},
			visible: false,
			Modal: false,
			mTitle: '模板列表',
			isTempC: false,
			mType: ''
		},
		methods: {
			// 自定义字段
			handleAdd: function(url) {
				this.formValidate.custemItems.push({
					name: 'jq_1_12_4',
					plugins: ''
				})
			},
			handleRemove: function(index) {
				this.formValidate.custemItems.splice(index, 1)
			},
			// 表单相关
			handleChange: function(data) {
				this.birthday = data
			},
			handleSubmit: function(name) {
				var me = this,
					fv = me.formValidate
				me.$refs[name].validate((valid) => {
					CMS.dateToStr(fv.custemItems)
					if (valid) {
						CMS.http.post(API.submit, fv, function(o) {
							console.log(o)
							VUE.$Message.success('创建成功!')
							location.href = `/shop/list?shopId=${shopId}`
						}, function(err) {
							VUE.$Message.warning(err.message)
							console.log(err)
						})
					} else {
						me.$Message.error('表单验证失败!')
					}
				})
			},
			getTemp: function(name) {
				var me      = this
				me.Modal    = true
				me.mType    = name
				me.listAPI  = API.templist
				me.isTempC  = false
				CMS.getDataList(me.listAPI, 'pageTemp')
			},
			handleCSel: function(item) {
				var me      = this
				me.mTitle   = item.name
				me.listAPI  = API.tempclist
				me.isTempC  = true
				me.pageTempC.search   = { tempId: item.id }
				me.pageTempC.total    = 0
				me.pageTempC.current  = 1
				me.pageTempC.dataList = []

				CMS.getDataList(me.listAPI, 'pageTempC')
			},
			handleSelRemove: function(type) {
				if (type === 'header' || type === 'footer') this.formValidate[type] = {}
				else this.formValidate.modelItems.splice(type, 1)
			},
			selModel: function(item) {
				var me = this, t = me.mType
				delete item.createdAt
				delete item.updatedAt
				delete item.preview
				delete item.tempId
				delete item.key
				if (t != 'modelItems') me.formValidate[me.mType] = item
				else me.formValidate[me.mType].push(item)
				me.mTitle   = '模板列表'
				me.Modal = false
				me.pageTemp.total    = 0
				me.pageTemp.current  = 1
				me.pageTemp.dataList = []
			},
			handleCtrl: function() {
				
			},
			handleReturn: function() {
				this.isTempC = false
			},
			// 排序
			sortList: function(opts) {
				var me    = this,
					key   = opts.key === 'levelName'? 'level': opts.key,
					order = opts.order,
					arr   = []
				if (order === 'desc') me.sort = '-' + key
				else if (order === 'asc') me.sort = key
				else me.sort = ''
				CMS.getDataList(me.listAPI)
			},
			// 页码切换
			changePage: function(cur) {
				this.current = cur
				CMS.getDataList(this.listAPI)
			},
			getShop: function(me) {
				CMS.http.get(API.get, { id: shopId }, function(o) {
					me.shop = o.data
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			getShopC: function() {
				var me = this
				CMS.http.get(API.getC, { id: id, shopId: shopId }, function(o) {
					CMS.merge2(me.formValidate, o.data)
					me.getShop(me)
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			load: function() {
				var me = this
				if (me.pageinfo.isEdit) {
					API.submit = '/shop/updateShopC'
					me.getShopC(me)
				} else {
					me.getShop(me)
				}
			}
		}
	}))

	VUE.$Message.config({ top: 100 })

}(window, window.VM, window.CMS))
