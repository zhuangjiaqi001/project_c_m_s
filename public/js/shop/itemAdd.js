(function(global, VM, CMS) {
	var API = {
		get:    '/shop/get',
		getC:   '/shop/getC',
		submit: '/shop/addShopC'
	},
	shopId = CMS.getQueryValue('shopId'),
	id   = CMS.getQueryValue('id')

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			shop: {},
			formValidate: {
				shopId:      shopId || '',
				id:          id     || '',
				name:        '',
				description: '',
				custemItems: [],
				title:       '',
				html:        '',
				css:         '',
				js:          ''
			},
			ruleValidate: {
				title: [
					{ required: true, message: '标题不能为空', trigger: 'blur' },
					{ type: 'string', min: 1, max: 30, message: '不超过30个字', trigger: 'blur' }
				]
			},
			uploadList: [],
			visible: false,
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
