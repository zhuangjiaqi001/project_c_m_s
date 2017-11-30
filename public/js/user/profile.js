(function(global, VM, CMS) {
	var API = '/user/getUserList'

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			birthday: '',
			imgs: [],
			formValidate: {
				email:       VM.data.user.email       || '',
				nickname:    VM.data.user.nickname    || '',
				gender:      VM.data.user.gender      || '',
				birthday:    VM.data.user.birthday    || '',
				blood_type:  VM.data.user.blood_type  || '',
				description: VM.data.user.description || ''
			},
			ruleValidate: {
				email: [
					{ required: true, message: '姓名不能为空', trigger: 'blur' },
					{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
				],
				nickname: [
					{ type: 'string', min: 2, message: '昵称不能少于2字', trigger: 'blur' }
				],
				description: [
					{ type: 'string', min: 10, message: '介绍不能少于10字', trigger: 'blur' }
				]
			},
			uploadList: [],
			visible: false,
			visibleImg: false,
			imgPrev: ''
		},
		methods: {
			// 表单相关
			handleChange (data) {
				this.birthday = data
			},
			handleSubmit (name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						this.formValidate.birthday = this.birthday
						CMS.http.post('/user/update', this.formValidate, function(o) {
							console.log(o)
							CMS.getUserInfo()
							VUE.$Message.success('提交成功!')
						}, function(err) {
							VUE.$Message.warning(err.message)
							console.log(err)
						})
					} else {
						this.$Message.error('表单验证失败!')
					}
				})
			},
			handleImgList () {
				CMS.http.get('/img/list', function(o) {
					console.log(o)
					VUE.imgs = o.data.list
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			handleView (url) {
				this.imgPrev = url
				this.visibleImg = true
			}
		}
	}))

	VUE.handleImgList()

	CMS.load = function(o) {
		VUE.formValidate.email = o.email
		VUE.formValidate.nickname = o.nickname
		VUE.formValidate.gender = o.gender
		VUE.formValidate.birthday = o.birthday
		VUE.formValidate.blood_type = o.blood_type
		VUE.formValidate.description = o.description
	}
	VUE.$Message.config({ top: 100 })

	// 用户头像上传
	$('.profile-avatar-input').CropAvatar(function(o) {
		CMS.http.post('/user/update', {
			avatar: o.data.url
		}, function(o) {
			console.log(o)
			CMS.getUserInfo()
		}, function(err) {
			VUE.$Message.warning(err.message)
			console.log(err)
		})
	})

}(window, window.VM, window.CMS))
