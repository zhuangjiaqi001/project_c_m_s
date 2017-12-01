(function(global, VM, CMS) {
	var API = pagecInfo.id? '/page/updatePageC': '/page/addPageC'

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			formValidate: {
				pageId:      ITEM.pageId,
				id:          pagecInfo.id || '',
				key:         pagecInfo.key,
				name:        ITEM.name,
				description: ITEM.description,
				custemItems: pagecInfo.custemItems || [],
				title:       pagecInfo.title
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
			handleSubmit: function(name) {
				var me = this,
					fv = me.formValidate
				me.$refs[name].validate((valid) => {
					CMS.dateToStr(fv.custemItems)
					console.log(fv)
					fv.html = encodeURIComponent(html.getContentTxt()).trim()
					debugger
					if (valid) {
						CMS.http.post(API, fv, function(o) {
							console.log(o)
							VUE.$Message.success('创建成功!')
							location.href = '/page/' + ITEM.pageId
						}, function(err) {
							VUE.$Message.warning(err.message)
							console.log(err)
						})
					} else {
						me.$Message.error('表单验证失败!')
					}
				})
			},
			load: function() {
				var me = this
				global.html = CMS.ueditor('edit_html')
				global.html.execCommand('source')
				if (me.pageinfo.isEdit) {
					me.initHTML()
				}
			},
			initHTML: function() {
				if (!pagecInfo.html) return
				global.html.ready(function() {
					global.html.setContent(pagecInfo.html)
				})
			}
		}
	}))

	VUE.$Message.config({ top: 100 })

}(window, window.VM, window.CMS))
