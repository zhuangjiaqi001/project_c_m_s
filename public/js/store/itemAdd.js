(function(global, VM, CMS) {
	var API = {
		templist:	'/shop/getShopList',
		tempclist:	'/shop/getShopCList',
		getShop: '/shop/getC',
		get:     '/store/get',
		getC:    '/store/getC',
		submit:  '/store/addStoreC'
	},
	storeId = CMS.getQueryValue('storeId'),
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
			store: {},
			formValidate: {
				storeId:      storeId || '',
				id:          id     || '',
				name:        '',
				description: '',
				title:       '',
				json:        '',
				html:        '',
				shop:        {},
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
			iframe:  false,
			visible: false,
			Modal:   false,
			mTitle:  '商店列表',
			isTempC: false,
			mType: '',
		},
		methods: {
			// 自定义字段
			handleAdd: function(url) {
				this.formValidate.custemItems.push({
					name: 'jq_1_12_4',
					plugins: ''
				})
			},
			// 表单相关
			handleChange: function(data) {
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
							location.href = `/store/list?storeId=${storeId}`
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
				me.pageTempC.search   = { shopId: item.id }
				me.pageTempC.total    = 0
				me.pageTempC.current  = 1
				me.pageTempC.dataList = []

				CMS.getDataList(me.listAPI, 'pageTempC')
			},
			handleSelRemove: function(type) {
				this.formValidate[type] = {}
				this.formValidate.json  = ''
			},
			selModel: function(item) {
				var me = this, t = me.mType
				delete item.createdAt
				delete item.updatedAt
				delete item.preview
				delete item.shopId
				delete item.key
				if (t != 'modelItems') {
					me.formValidate[me.mType] = item
					me.getShop(me, item.id)
				}
				me.mTitle   = '商店列表'
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
			openFrame: function() {
				this.iframe = true
			},
			closeFrame: function() {
				var fwin = $('.editor-frame')[0].contentWindow,
					html = fwin.document.querySelector('#page_content').innerHTML
				this.formValidate.json = JSON.stringify(fwin.VUE.json)
				this.formValidate.html = html
				console.log(html)
				this.iframe = false
			},
			getShop: function(me, shopId) {
				CMS.http.get(API.getShop, { id: shopId }, function(o) {
					me.formValidate.shop = o.data
					me.formValidate.json = o.data.json || ''
					me.iframe = true
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			getStore: function(me) {
				CMS.http.get(API.get, { id: storeId }, function(o) {
					me.store = o.data
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			getStoreC: function() {
				var me = this
				CMS.http.get(API.getC, { id: id, storeId: storeId }, function(o) {
					CMS.merge2(me.formValidate, o.data)
					me.getStore(me)
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			load: function() {
				var me = this
				if (me.pageinfo.isEdit) {
					API.submit = '/store/updateStoreC'
					me.getStoreC(me)
				} else {
					me.getStore(me)
				}
			}
		}
	}))

	VUE.$Message.config({ top: 100 })

}(window, window.VM, window.CMS))
