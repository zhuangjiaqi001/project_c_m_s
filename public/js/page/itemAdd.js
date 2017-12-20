(function(global, VM, CMS) {
	var API = {
		templist:	'/temp/getTempList',
		tempclist:	'/temp/getTempCList',
		get:        '/page/get',
		getC:       '/page/getC',
		submit:		'/page/addPageC'
	},
	pageId = CMS.getQueryValue('pageId'),
	id     = CMS.getQueryValue('id');


	global.handleCSel = function(item) {
		VUE.handleCSel(item)
	}
	global.selModel = function(item) {
		VUE.selModel(item)
	}
	global.widthCheck = function(rule, val, cb) {
		if (!/^\d+$/.test(val)) cb(new Error(`值必须为正整数`))
		else if (val < rule.min || val > rule.max) cb(new Error(`值必须在 ${rule.min} 和 ${rule.max} 之间`))
		else cb()
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
			page: {},
			formValidate: {
				pageId:      pageId || '',
				id:          id || '',
				key:         '',
				description: '',
				custemItems: [],
				modelItems:  [],
				title:       '',
				width:       '1000',
				header:      {},
				footer:      {}
			},
			ruleValidate: {
				title: [
					{ required: true, message: '标题不能为空', trigger: 'blur' },
					{ type: 'string', min: 1, max: 30, message: '不超过30个字', trigger: 'blur' }
				],
				width: [
					{ required: true, message: '页面宽度不能为空', trigger: 'blur' },
					{ validator: widthCheck, min: 640, max: 1600, message: '数值超出范围', trigger: 'blur' }
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
			handleSubmit: function(name) {
				var me = this,
					fv = me.formValidate
				me.$refs[name].validate((valid) => {
					CMS.dateToStr(fv.modelItems)
					console.log(fv)
					fv.html = encodeURIComponent(html.getContent())
					if (valid) {
						CMS.http.post(API.submit, fv, function(o) {
							console.log(o)
							VUE.$Message.success('创建成功!')
							location.href = `/page/list?pageId=${pageId}`
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
			initHTML: function(da) {
				if (!da.html) return
				global.html.ready(function() {
					global.html.setContent(da.html)
				})
			},
			getPage: function(me) {
				CMS.http.get(API.get, { id: pageId }, function(o) {
					me.page = o.data
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			getPageC: function() {
				var me = this
				CMS.http.get(API.getC, { id: id, pageId: pageId }, function(o) {
					CMS.merge2(me.formValidate, o.data)
					me.getPage(me)
					me.initHTML(o.data)
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			load: function() {
				var me = this
				if (me.pageinfo.isEdit) {
					API.submit = '/page/updatePageC'
					me.getPageC(me)
				} else {
					me.getPage(me)
				}
				global.html = CMS.ueditor('edit_html')
			}
		}
	}))

	VUE.$Message.config({ top: 100 })


}(window, window.VM, window.CMS))
