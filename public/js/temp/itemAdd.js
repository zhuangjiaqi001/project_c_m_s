(function(global, VM, CMS) {
	var API = tempcInfo.id? '/temp/updateTempC': '/temp/addTempC'

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			formValidate: {
				tempId:      ITEM.tempId,
				id:          tempcInfo.id || '',
				key:         tempcInfo.key,
				name:        ITEM.name,
				description: ITEM.description,
				title:       tempcInfo.title
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
			// 表单相关
			handleChange: function(data) {
				this.birthday = data
			},
			handleSubmit: function(name) {
				this.$refs[name].validate((valid) => {
					CMS.dateToStr(this.formValidate.custemItems)
					console.log(this.formValidate)
					if (valid) {
						CMS.http.post(API, this.formValidate, function(o) {
							console.log(o)
							VUE.$Message.success('创建成功!')
							location.href = '/temp/' + ITEM.tempId
						}, function(err) {
							VUE.$Message.warning(err.message)
							console.log(err)
						})
					} else {
						this.$Message.error('表单验证失败!')
					}
				})
			},
			load: function() {
				// global.ck = CMS.ckedit('edit')
				global.ue = CMS.ueditor('edit')
			}
		}
	}))

	VUE.$Message.config({ top: 100 })

}(window, window.VM, window.CMS))
