(function(global, VM, CMS) {
	var API = {
		get:    '/txtrp/get',
		getC:   '/txtrp/getC',
		submit: '/txtrp/addTxtRPC'
	},
	rpId = CMS.getQueryValue('rpId'),
	id   = CMS.getQueryValue('id')

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			custemItems: [],
			formValidate: {
				id:          id   || '',
				rpId:        rpId || '',
				key:         '',
				name:        '',
				description: '',
				title:       '',
				url:         '',
				startTime:   '',
				endTime:     '',
				custemItems: {}
			},
			ruleValidate: {
				title: [
					{ required: true, message: '标题不能为空', trigger: 'blur' },
					{ type: 'string', min: 1, max: 30, message: '不超过30个字', trigger: 'blur' }
				],
				url: [
					{ type: 'url', message: '链接格式错误', trigger: 'blur' }
				]
			}
		},
		methods: {
			// 表单相关
			handleChange: function(data) {
				this.birthday = data
			},
			handleSubmit: function(name) {
				var me = this
				me.$refs[name].validate((valid) => {
					CMS.dateToStr(me.formValidate.custemItems)
					if (valid) {
						var da = JSON.parse(JSON.stringify(me.formValidate))
						da.custemItems = JSON.stringify(da.custemItems)
						CMS.http.post(API.submit, da, function(o) {
							console.log(o)
							VUE.$Message.success('创建成功!')
							location.href = `/txtrp/list?rpId=${rpId}`
						}, function(err) {
							VUE.$Message.warning(err.message)
							console.log(err)
						})
					} else {
						me.$Message.error('表单验证失败!')
					}
				})
			},
			getTxtRP: function(me) {
				CMS.http.get(API.get, { id: rpId }, function(o) {
					var ci = me.formValidate.custemItems
					me.custemItems = o.data.custemItems
					delete o.data.custemItems
					delete o.data.id
					if (me.pageinfo.isEdit) {
						for (var key in ci) {
							var nkey = ''
							me.custemItems.map(function(j) {
								if (j.key === key) {
									nkey = j.key
								}
							})
							if (!nkey) {
								delete ci[key]
							}
						}
					} else {
						me.custemItems.map(function(i) {
							VUE.$set(ci, i.key, '')
						})
					}
					CMS.merge2(me.formValidate, o.data)
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			getTxtRPC: function(me) {
				CMS.http.get(API.getC, { id: id }, function(o) {
					CMS.merge2(me.formValidate, o.data)
					if (o.data.imageUrl) VUE.uploadList.push({ url: o.data.imageUrl })
					me.getTxtRP(me)
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			load: function() {
				var me = this
				if (me.pageinfo.isEdit) {
					API.submit = '/txtrp/updateTxtRPC'
					me.getTxtRPC(me)
				} else {
					me.getTxtRP(me)
				}
			}
		}
	}))

	VUE.$Message.config({ top: 100 })

}(window, window.VM, window.CMS))
