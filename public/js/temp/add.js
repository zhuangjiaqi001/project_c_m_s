(function(global, VM, CMS) {
	var API = tempInfo.id? '/temp/updateTemp': '/temp/addTemp'

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			birthday: '',
			formValidate: {
				id:   tempInfo.id,
				key:  tempInfo.key,
				name: tempInfo.name,
				description: tempInfo.description
			},
			ruleValidate: {
				key: [
					{ required: true, message: '模板类KEY不能为空', trigger: 'blur' },
					{ type: 'string', min: 15, message: '模板类KEY不能少于15字', trigger: 'blur' }
				],
				name: [
					{ required: true, message: '模板类名称不能为空', trigger: 'blur' },
					{ type: 'string', min: 5, message: '模板类名称不能少于5字', trigger: 'blur' }
				]
			},
			visible: false,
		},
		methods: {
			// 表单相关
			handleChange: function(data) {
				this.birthday = data
			},
			handleSubmit: function(name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						console.log(this.formValidate)
						CMS.http.post(API, this.formValidate, function(o) {
							VUE.$Message.success('提交成功!')
							location.href = '/temp'
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
			}
		}
	}))

	VUE.$Message.config({ top: 100 })

}(window, window.VM, window.CMS))
