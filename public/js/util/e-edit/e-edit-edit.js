(function() {
	var formatObj = { jpg: 1, jpeg: 1, png: 1, gif: 1 }

	Vue.directive('focus', {
		inserted: function (el) {
			el.focus()
		}
	})
	Vue.component('e-text', {
		props: ['value'],
		template: `<span class="e-pos-rep" @dblclick="editActive" :class="value === ''? 'e-null': ''">
				<input class="e-text" v-if="isEdit === true" :style="size" v-model="content" @blur="submit" v-focus="isFocus"></input>
				<span v-if="isEdit === false">{{value}}</span>
			</span>`,
		data: function() {
			return {
				content: this.value,
				isEdit: false,
				isFocus: false,
				size: { width: 0, height: 0 },
			}
		},
		methods: {
			editActive: function(el) {
				this.size = {
					width:  el.currentTarget.offsetWidth  + 'px',
					height: el.currentTarget.offsetHeight + 'px'
				}
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
		template: `<div class="e-pos-rep" @dblclick="editActive" :class="contentList.length === 1 && contentList[0] === ''? 'e-null': ''">
				<textarea class="e-textarea" v-if="isEdit === true" :style="size" v-model="content" @blur="submit" v-focus="isFocus"></textarea>
				<p v-if="isEdit === false" v-for="p in contentList">{{p}}</p>
			</div>`,
		data: function() {
			return {
				content: this.value,
				contentList: [],
				isEdit: false,
				isFocus: false,
				size: { width: 0, height: 0 },
			}
		},
		methods: {
			editActive: function(el) {
				this.size = {
					width:  el.currentTarget.offsetWidth  + 'px',
					height: el.currentTarget.offsetHeight + 'px'
				}
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
		template: `<div class="e-pos-rep e-image">
				<img :src="value" :style="value? '': 'opacity: 0'">
				<div class="e-icon">
					<a class="e-icon-fa e-update"><i class="fa fa-edit"></i><input class="e-update-file" type="file" @change="update"></a>
					<a class="e-icon-fa" @click="remove"><i class="fa fa-trash-o"></i></a>
				</div>
			</div>`,
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
		template: `<div class="e-pos-rep e-image">
				<div :class="eClass" :style="'background-image: url(' + value + ');'"><slot></slot></div>
				<div class="e-icon">
					<a class="e-icon-fa e-update"><i class="fa fa-edit"></i><input class="e-update-file" type="file" @change="update"></a>
					<a class="e-icon-fa" @click="remove"><i class="fa fa-trash-o"></i></a>
				</div>
			</div>`,
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

var VUE

(function() {
	if (self === top) return;

	var shop = top.VUE.formValidate.shop,
		json = top.VUE.formValidate.json
	try {
		json = JSON.parse(json)
		VUE = new Vue({
			el: '#v_edit_app',
			data: {
				json: json
			},
			methods: {
			},
			mounted: function() {
			}
		})
	} catch (e) {
		console.log(e)
	}
}())
