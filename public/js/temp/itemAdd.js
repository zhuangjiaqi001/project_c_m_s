(function(global, VM, CMS) {
	var API = {
		get:    '/temp/getC',
		submit: '/temp/addTempC'
	},
	mt = location.pathname.match(/temp\/(\d+)\/(add|edit)\/?(\d+)?$/),
	tempId = mt? mt[1]: '',
	id     = mt? mt[3]: ''

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			formValidate: {
				tempId:      tempId || '',
				id:          id     || '',
				key:         '',
				name:        '',
				description: '',
				custemItems: [],
				title:       '',
				html:        '',
				css:         '',
				js:          ''
			},
			ruleValidate: {
				key: [
					{ required: true, message: 'KEY不能为空', trigger: 'blur' },
					{ type: 'string', min: 15, message: 'KEY不能少于15字', trigger: 'blur' }
				],
				title: [
					{ required: true, message: '标题不能为空', trigger: 'blur' },
					{ type: 'string', min: 1, max: 30, message: '不超过30个字', trigger: 'blur' }
				]
			},
			uploadList: [],
			visible: false,
			loadLib: [
				{ name: 'jQuery 1.12.4', val: 'jq_1_12_4' },
				{ name: 'jQuery 2.2.4', val: 'jq_2_2_4' },
				{ name: 'jQuery 3.2.1', val: 'jq_3_2_1' },
				{ name: 'Zepto 1.0rc1', val: 'zepto_1_0rc1' },
				{ name: 'AngularJS 1.2.1', val: 'ang_1_2_1' },
				{ name: 'Vue 2.2.6', val: 'vue_2_2_6' }
			]
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
							location.href = '/temp/' + tempId
						}, function(err) {
							VUE.$Message.warning(err.message)
							console.log(err)
						})
					} else {
						me.$Message.error('表单验证失败!')
					}
				})
			},
			getTempC: function() {
				var me = this
				CMS.http.get(API.get, { id: id, tempId: tempId }, function(o) {
					CMS.merge2(me.formValidate, o.data)
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			load: function() {
				if (this.pageinfo.isEdit) {
					API.submit = '/temp/updateTempC'
					this.getTempC()
				}
			}
		}
	}))

	VUE.$Message.config({ top: 100 })

}(window, window.VM, window.CMS))
