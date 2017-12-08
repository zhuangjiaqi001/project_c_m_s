(function(global) {

String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, '')
}
String.prototype.htmlDecode = function() {
	var text = this,
		re = {
			'&lt;': '<',
			'&gt;': '>',
			'&amp;': '&',
			'&quot;': '"'
		};
	for (var i in re) {
		text = text.replace(new RegExp(i, 'g'), re[i])
	}
	return text
}

if (!global.CMS) {

	global.VM = {
		el: '#vApp',
		data: {
			// 菜单切换变量
			drop: {
				user: false,
				notice: false
			},
			pageinfo: {
				isEdit: /(e|E)dit$/.test(location.pathname)
			},
			user: {},
			loadLib: [
				{ name: 'jQuery 1.12.4', val: 'jq_1_12_4' },
				{ name: 'jQuery 2.2.4', val: 'jq_2_2_4' },
				{ name: 'jQuery 3.2.1', val: 'jq_3_2_1' },
				{ name: 'Zepto 1.0rc1', val: 'zepto_1_0rc1' },
				{ name: 'AngularJS 1.2.1', val: 'ang_1_2_1' },
				{ name: 'Vue 2.2.6', val: 'vue_2_2_6' }
			],
			loadImgRP: [
				{ name: '文本', val: 'String' },
				{ name: '布尔值', val: 'Boolean' },
				{ name: '日期', val: 'Date' },
				{ name: '图片', val: 'Image' },
			],
			loadTxtRP: [
				{ name: '文本', val: 'String' },
				{ name: '布尔值', val: 'Boolean' },
				{ name: '日期', val: 'Date' }
			],
			history_time: new Date()-0
		},
		methods: {
			// 菜单切换
			handleMenuDrop (name) {
				this.drop[name] = this.drop[name]? false: true
			},
			/* 图片上传相关 (开始) */
			handleView (url) {
				this.imgName = url
				this.visible = true
			},
			handleRemove (file) {
				// 从 upload 实例删除数据
				const fileList = this.uploadList
				fileList.splice(fileList.indexOf(file), 1)
			},
			imgRemove (key) {
				var me = this
				if (me.imgList) me.imgList[key] = {}
				if (me.formValidate.custemItems) me.formValidate.custemItems[key] = ''
			},
			handleSuccess (res, file) {
				// 因为上传过程为实例，这里模拟添加 url
				if (res.code === '0000') {
					console.log(res)
					file = res.data
					this.uploadList.push(file)
					if (this.formValidate) {
						this.formValidate.imageUrl = file.url
						this.$refs.formValidate.validateField('imageUrl')
					}
				} else {
					VUE.$Message.warning(res.message)
				}
			},
			imgSuccess (key) {
				return (function(res, file) {
					var fn = function(res, file) {
						if (res.code === '0000') {
							console.log(res)
							if (VUE.formValidate && VUE.formValidate.custemItems) {
								var ci  = VUE.formValidate.custemItems,
									key = fn.prototype.key
								if (VUE.imgList) Vue.set(VUE.imgList, key, file)
								Vue.set(ci, key, res.data.url)
							}
						} else {
							VUE.$Message.warning(res.message)
						}
					}
					fn.prototype.key  = key
					return fn
				}).call(key)
			},
			handleFormatError (file) {
				this.$Notice.warning({
					title: '文件格式不正确',
					desc: '文件格式不正确，请上传 jpg, png 或 gif 格式的图片!'
				})
			},
			handleMaxSize (file) {
				this.$Notice.warning({
					title: '超出文件大小限制',
					desc: '文件太大了!'
				})
			},
			handleBeforeUpload () {
				const check = this.uploadList.length < 1
				if (!check) {
					this.$Notice.warning({ title: '最多只能上传 1 张图片!' })
				}
				return check
			},
			/* 图片上传相关 (结束) */
			/* 表单相关 (开始) */
			// 表单重置
			handleReset: function(name) {
				this.$refs[name].resetFields()
			}
		},
		mounted() {
			var me = this
			me.load && me.load()
		}
	}
	global.CMS = {
		http: {
			ajax: function(type, url, data, success, error) {
				var _data, _success, _error
				if (typeof(data)==='function') {
					_data    = {}
					_success = data
					_error   = success
				} else {
					_data    = data
					_success = success
					_error   = error
				}
				$.ajax({
					url: '/api' + (url || ''),
					data: _data,
					type: type,
					success: function(d) {
						if (d.code === '0000') {
							_success && _success(d)
						} else if (d.code === '0001') {
							alert(d.message, function() {
								global.location.href = '/logout'
							})
						} else {
							_error && _error(d)
						}
					},
					error: function(err) {
						if (typeof(_error)==='function') _error(err)
					}
				})
			},
			get: function(url, data, success, error) {
				this.ajax('get', url, data, success, error)
			},
			post: function(url, data, success, error) {
				this.ajax('post', url, data, success, error)
			}
		},
		// 获取用户信息
		getUserInfo: function() {
			var me = this
			$.ajax({ url: '/api/user/getUserInfo'})
			.done(function(o) {
				console.log(o)
				if (o.code === '0000') {
					global.VM.data.user = o.data
					if (me.load && !me.isLoad) me.load(o.data)
					me.isLoad = false
				} else if (o.code === '0006') {
					location.href = '/logout'
				}
			})
			var mt = location.pathname.match(/\w+/)
			if (!mt) return
			var sb = $('#sb_'+mt[0])
			if (sb.length) {
				sb.addClass('active')
			}
		},
		// 获取Url参数
		getQueryValue: function(key) {
			var r = global.location.search.match(new RegExp('[\\?|\\&]' + key + '=([^\\&]*)', 'i'))
			return r? decodeURIComponent(r[1]): ''
		},
		// 获取对象的真实类型
		__getClass: function(obj) {
			return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1]
		},
		// Object继承
		extend: function(org, obj) {
			var me = this
			for (var v in obj) {
				if (!org[v]) {
					org[v] = obj[v]
				} else {
					var typeO = me.__getClass(org[v]),
						typeN = me.__getClass(obj[v])
					if (typeO === typeO && typeO === 'Object') {
						me.extend(org[v], obj[v])
					} else {
						org[v] = obj[v]
					}
				}
			}
			return org
		},
		merge: function(org, now) {
			for (var v in org) {
				if (org[v]) now[v] = org[v]
			}
		},
		merge2: function(org, now) {
			for (var v in org) {
				if (now[v]) org[v] = now[v]
			}
		},
		// 获取列表
		getDataList: function(api, path) {
			var me = this,
				data = path? VM.data[path]: VM.data,
				da = {
					page: data.current || 1,
					pageSize: data.pageSize || 10,
				},
				_time = new Date()-0
			me.merge(data.search || {}, da)
			if (data.sort) da.sort = data.sort
			if (me.history_time > (_time - 2000)) return
			me.history_time = _time
			me.http.get(api, da, function(d) {
				data.dataList = d.data.list
				data.total    = d.data.pageInfo.total
				data.current  = d.data.pageInfo.current
			})
		},
		// 日期格式化
		formatDate: function(date, format) {
			if (isNaN(date)) return ''
			var o = {
				'm+': date.getMonth() + 1,
				'd+': date.getDate(),
				'h+': date.getHours(),
				'n+': date.getMinutes(),
				's+': date.getSeconds()
			}
			if (/(y+)/.test(format)) {
				format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
			}
			for (var k in o) {
				if (new RegExp('('+ k +')').test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
				}
			}
			return format
		},
		// Object内Date转string
		dateToStr: function(obj) {
			for (var p in obj) {
				var v = obj[p],
					t = CMS.__getClass(v)
				if (t === 'Date') {
					obj[p] = CMS.formatDate(v, 'yyyy/mm/dd hh:nn:ss')
				}
			}
		},
		// 编辑器
		ckedit: function(id) {
			return global.CKEDITOR? global.CKEDITOR.replace(id): ''
		},
		ueditor: function(id) {
			return global.UE? global.UE.getEditor(id): ''
		}
	}
	global.CMS.getUserInfo()
}

}(window))