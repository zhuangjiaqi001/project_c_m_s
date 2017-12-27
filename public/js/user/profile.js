(function(global, VM, CMS) {
	var API = {
		submit: '/user/update',
		getLog: '/log/getLogList',
		getImg: '/img/list',
	}

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
			imgPrev: '',
			timeline: [],
			tType: {
				file:   '图片',
				imgrp:  '图片推荐位列表',
				imgrpc: '推荐位',
				txtrp:  '文字推荐位列表',
				txtrpc: '推荐位',
				temp:   '模块列表',
				tempc:  '模块',
				page:   '落地页列表',
				pagec:  '落地页',
				shop:   '店铺模板列表',
				shopc:  '店铺模板',
				store:  '店铺页列表',
				storec: '店铺页',
				user:   '用户',
			},
			tDirective: {
				add:     '添加',
				update:  '更新',
				remove:  '删除',
				release: '发布',
				offline: '下线',
				sort:    '排序',
			},
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
						CMS.http.post(API.submit, this.formValidate, function(o) {
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
				CMS.http.get(API.getImg, function(o) {
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
			},
			getLog (me) {
				CMS.http.get(API.getLog, function(o) {
					me.timeline = o.data.list
					console.log(o)
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			load: function() {
				this.getLog(this)
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
		CMS.http.post(API.submit, {
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
