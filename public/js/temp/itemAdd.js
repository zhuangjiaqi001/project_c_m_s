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
				custemItems: tempcInfo.custemItems || [],
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
			loadLib: [
				{ name: 'jQuery 1.12.4', val: 'jq_1_12_4' },
				{ name: 'jQuery 2.2.4', val: 'jq_2_2_4' },
				{ name: 'jQuery 3.2.1', val: 'jq_3_2_1' },
				{ name: 'Zepto 1.0rc1', val: 'zepto_1_0rc1' },
				{ name: 'AngularJS 1.2.1', val: 'ang_1_2_1' },
				{ name: 'Vue 2.2.6', val: 'vue_2_2_6' }
			]
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
					console.log(fv)
					fv.css  = encodeURIComponent(css.getContentTxt()).trim()
					fv.html = encodeURIComponent(html.getContentTxt()).trim()
					fv.js   = encodeURIComponent(js.getContentTxt()).trim()
					debugger
					if (valid) {
						CMS.http.post(API, fv, function(o) {
							console.log(o)
							VUE.$Message.success('创建成功!')
							location.href = '/temp/' + ITEM.tempId
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
				global.css  = CMS.ueditor('edit_css')
				global.html = CMS.ueditor('edit_html')
				global.js   = CMS.ueditor('edit_js')
				global.css.execCommand('source')
				global.html.execCommand('source')
				global.js.execCommand('source')
				if (me.pageinfo.isEdit) {
					me.initHTML()
					me.initCSS()
					me.initJS()
				}
			},
			initHTML: function() {
				if(!tempcInfo.html) return
				global.html.ready(function(){
					global.html.setContent(tempcInfo.html)
				})
			},
			initCSS: function() {
				if(!tempcInfo.css) return
				global.css.ready(function(){
					global.css.setContent(tempcInfo.css)
				})
			},
			initJS: function() {
				if(!tempcInfo.js) return
				global.js.ready(function(){
					global.js.setContent(tempcInfo.js)
				})
			}
		}
	}))

	VUE.$Message.config({ top: 100 })

}(window, window.VM, window.CMS))
