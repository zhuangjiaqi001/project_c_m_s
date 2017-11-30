(function(global) {

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
				isEdit: /\/edit/.test(location.pathname)
			},
			user: {}
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
			var sb = $('#sb_'+INIT.active)
			if (sb.length) {
				sb.addClass('active')
			}
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
		// 获取列表
		getDataList: function(api) {
			var da = {
				page: VM.data.current || 1,
				pageSize: VM.data.pageSize || 10,
			}
			this.merge(VM.data.search || {}, da)
			if (VM.data.sort) da.sort = VM.data.sort
			this.http.get(api, da, function(d) {
				VM.data.dataList = d.data.list
				VM.data.total    = d.data.pageInfo.total
				VM.data.current  = d.data.pageInfo.current
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