(function() {
	var formatObj = { jpg: 1, jpeg: 1, png: 1, gif: 1 }

	Vue.directive('focus', {
		inserted: function (el) {
			el.focus()
		}
	})
	Vue.component('e-text', {
		props: ['value'],
		template: '#e-text',
		data: function() {
			return {
				content: this.value,
				isEdit: false,
				isFocus: false,
				w: 0,
				h: 0,
			}
		},
		methods: {
			editActive: function(el) {
				this.w = el.currentTarget.offsetWidth
				this.h = el.currentTarget.offsetHeight
				this.isEdit = this.isFocus = true
			},
			submit: function() {
				this.isEdit = this.isFocus = false
				this.$emit('input', this.content)
			},
		}
	})
	Vue.component('e-textarea', {
		props: ['value'],
		template: '#e-textarea',
		data: function() {
			return {
				content: this.value,
				contentList: [],
				isEdit: false,
				isFocus: false,
				w: 0,
				h: 0,
			}
		},
		methods: {
			editActive: function(el) {
				this.w = el.currentTarget.offsetWidth
				this.h = el.currentTarget.offsetHeight
				this.isEdit = this.isFocus = true
			},
			submit: function() {
				var me = this
				me.contentList = descList(me.content)
				me.isEdit = me.isFocus = false
				me.$emit('input', me.content)
			},
		},
		mounted: function() {
			this.contentList = descList(this.content)
		}
	})
	Vue.component('e-image', {
		props: ['value'],
		template: '#e-image',
		data: function() {
			return { e_format: accept(this.format || []), }
		},
		methods: {
			update: function(e) {
				var me = this
				update(me, e)
			},
			remove: function() {
				this.$emit('input', '')
			}
		},
		mounted: function() {
		}
	})
	Vue.component('e-bgimage', {
		props: ['value', 'eClass', 'maxSize', 'format'],
		template: '#e-bgimage',
		data: function() {
			return { e_format: accept(this.format || []), }
		},
		methods: {
			update: function(e) {
				var me = this
				update(me, e)
			},
			remove: function() {
				this.$emit('input', '')
			}
		},
		mounted: function() {
		}
	})

	function descList(str) {
		str = str.length > 1000? str.substr(0, 1000): str
		str = str.replace(/(^\n*)|(\n*$)/g, '').replace(/\n+/g, '|*|')
		return str.split('|*|')
	}
	function accept(arr) {
		var ac = []
		arr = arr.length? arr: ['jpg', 'jpeg', 'png']
		arr.map(function(_) {
			if (formatObj[_]) ac.push('image/' + _)
		})
		return ac.join(', ')
	}
	function update(me, e, cb) {
		var files = e.target.files
		if (files && files.length) {
			var form = new FormData(),
				file = me.file = e.target,
				f    = files[0],
				t    = f.type
			var size = me.maxSize >= 1024 ? `${me.maxSize / 1024}MB` : `${me.maxSize}KB`
			if(me.e_format.indexOf(t) < 0){
				e.target.value = ''
				return alert(`上传失败，请上传大小${size}以内的 ${me.e_format.replace(/image\//g, '')} 格式的图片`)
			}
			if (f.size > me.maxSize*1024) {
				e.target.value = ''
				return alert(`上传失败，请上传大小${size}以内的 ${me.e_format.replace(/image\//g, '')} 格式的图片`)
			}
			form.append('file', f)
			$.ajax({
				url: '/api/file/ue?action=uploadimage',
				type: 'post',
				data: form,
				processData: false,
				contentType: false,
				success: function(d) {
					if (d.state === 'SUCCESS') {
						if (cb) cb(d.url)
						else me.$emit('input', d.url)
					} else {
						alert(d.message)
					}
					e.target.value = ''
				},
				error: function(err) {
					alert('网络错误!')
					e.target.value = ''
				}
			})
		} else {
			e.target.value = ''
		}
	}
}());
