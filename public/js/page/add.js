(function(global, VM, CMS) {
	var API = {
		get:    '/page/get',
		submit: '/page/addPage'
	},
	id = CMS.getQueryValue('pageId')

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			formValidate: {
				id:          id || '',
				key:         '',
				name:        '',
				description: ''
			},
			ruleValidate: {
				key: [
					{ required: true, message: '落地页列表KEY不能为空', trigger: 'blur' },
					{ type: 'string', min: 15, message: '落地页列表KEY不能少于15字', trigger: 'blur' }
				],
				name: [
					{ required: true, message: '落地页列表名称不能为空', trigger: 'blur' },
					{ type: 'string', min: 5, message: '落地页列表名称不能少于5字', trigger: 'blur' }
				]
			},
			visible: false,
		},
		methods: {
			// 表单相关
			handleSubmit: function(name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						CMS.http.post(API.submit, this.formValidate, function(o) {
							VUE.$Message.success('提交成功!')
							location.href = '/page'
						}, function(err) {
							VUE.$Message.warning(err.message)
							console.log(err)
						})
					} else {
						this.$Message.error('表单验证失败!')
					}
				})
			},
			handleReset: function(name) {
				this.$refs[name].resetFields()
			},
			getPage: function() {
				var me = this
				CMS.http.get(API.get, { id: id }, function(o) {
					CMS.merge2(me.formValidate, o.data)
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			load: function() {
				if (this.pageinfo.isEdit) {
					API.submit = '/page/updatePage'
					this.getPage()
				}
			}
		}
	}))

	VUE.$Message.config({ top: 100 })

}(window, window.VM, window.CMS))
