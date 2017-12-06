(function(global, VM, CMS) {
	var API = {
		get:    '/temp/get',
		getC:   '/temp/getC',
		submit: '/temp/addTempC'
	},
	tempId = CMS.getQueryValue('tempId'),
	id   = CMS.getQueryValue('id')

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			temp: {},
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
							location.href = `/temp/list?tempId=${tempId}`
						}, function(err) {
							VUE.$Message.warning(err.message)
							console.log(err)
						})
					} else {
						me.$Message.error('表单验证失败!')
					}
				})
			},
			getTemp: function(me) {
				CMS.http.get(API.get, { id: tempId }, function(o) {
					me.temp = o.data
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			getTempC: function() {
				var me = this
				CMS.http.get(API.getC, { id: id, tempId: tempId }, function(o) {
					CMS.merge2(me.formValidate, o.data)
					me.getTemp(me)
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			load: function() {
				var me = this
				if (me.pageinfo.isEdit) {
					API.submit = '/temp/updateTempC'
					me.getTempC(me)
				} else {
					me.getTemp(me)
				}
			}
		}
	}))

	VUE.$Message.config({ top: 100 })

}(window, window.VM, window.CMS))
