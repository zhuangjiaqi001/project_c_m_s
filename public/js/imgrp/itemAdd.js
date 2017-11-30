(function(global, VM, CMS) {
	var API = rpcInfo.id? '/imgrp/updateImgRPC': '/imgrp/addImgRPC'

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			formValidate: {
				rpId:        ITEM.rpId,
				id:          rpcInfo.id || '',
				key:         ITEM.key,
				name:        ITEM.name,
				description: ITEM.description,
				title:       rpcInfo.title,
				imageUrl:    rpcInfo.imageUrl,
				url:         rpcInfo.url,
				startTime:   rpcInfo.startTime,
				endTime:     rpcInfo.endTime,
				custemItems: rpcInfo.custemItems || {}
			},
			ruleValidate: {
				title: [
					{ required: true, message: '标题不能为空', trigger: 'blur' },
					{ type: 'string', min: 1, max: 30, message: '不超过30个字', trigger: 'blur' }
				],
				imageUrl: [
					{ required: true, message: '图片未上传', trigger: 'change' }
				],
				url: [
					{ type: 'url', message: '链接格式错误', trigger: 'blur' }
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
							location.href = '/imgrp/' + ITEM.rpId
						}, function(err) {
							VUE.$Message.warning(err.message)
							console.log(err)
						})
					} else {
						this.$Message.error('表单验证失败!')
					}
				})
			}
		}
	}))

	if (rpcInfo.imageUrl) VUE.uploadList.push({ url: rpcInfo.imageUrl })

	VUE.$Message.config({ top: 100 })

}(window, window.VM, window.CMS))
