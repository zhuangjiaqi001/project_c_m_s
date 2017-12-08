(function(global, VM, CMS) {
	var API = {
		get:    '/txtrp/get',
		submit: '/txtrp/addTxtRP'
	},
	id = CMS.getQueryValue('rpId')

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			birthday: '',
			formValidate: {
				id:   id,
				key:  '',
				name: '',
				description: '',
				custemItems: []
			},
			ruleValidate: {
				key: [
					{ required: true, message: '推荐位KEY不能为空', trigger: 'blur' },
					{ type: 'string', min: 15, message: '推荐位KEY不能少于15字', trigger: 'blur' }
				],
				name: [
					{ required: true, message: '推荐位名称不能为空', trigger: 'blur' },
					{ type: 'string', min: 5, message: '推荐位名称不能少于5字', trigger: 'blur' }
				]
			},
			uploadList: [],
			visible: false,
		},
		methods: {
			// 自定义字段
			handleAdd (url) {
				this.formValidate.custemItems.push({
                    key:  '',
                    name: '',
                    type: 'String'	// String, Number, Boolean
                })
			},
			handleRemove (index) {
				this.formValidate.custemItems.splice(index, 1)
			},
			// 表单相关
			handleChange: function(data) {
				this.birthday = data
			},
			handleSubmit: function(name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						console.log(this.formValidate)
						CMS.http.post(API.submit, this.formValidate, function(o) {
							VUE.$Message.success('提交成功!')
							location.href = '/txtrp'
						}, function(err) {
							VUE.$Message.warning(err.message)
							console.log(err)
						})
					} else {
						this.$Message.error('表单验证失败!')
					}
				})
			},
			getData: function() {
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
					API.submit = '/txtrp/updateTxtRP'
					this.getData()
				}
			}
		}
	}))

	VUE.$Message.config({ top: 100 })

}(window, window.VM, window.CMS))
