(function() {
	var formatObj = { jpg: 1, jpeg: 1, png: 1, gif: 1 },
		errMsg = function(str) {
			alert(str || '本地环境无法执行该操作!')
		}

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
					width:  el.currentTarget.offsetWidth + 40  + 'px',
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
		template: `<div class="e-pos-rep e-image" @mouseenter="editOn" @mouseleave="editOff">
				<img :src="value" :style="value? '': 'opacity: 0'">
				<div v-if="isEdit" class="e-icon">
					<a class="e-icon-fa e-update" @click="upload"><i class="fa fa-edit"></i></a>
					<a class="e-icon-fa" @click="remove"><i class="fa fa-trash-o"></i></a>
				</div>
			</div>`,
		data: function() {
			return {
				e_format: accept(this.format || []),
				isEdit: false,
			}
		},
		methods: {
			editOn: function() {
				this.isEdit = true
			},
			editOff: function() {
				this.isEdit = false
			},
			upload: function() {
				errMsg()
			},
			remove: function() {
				errMsg()
			}
		},
		mounted: function() {
		}
	})
	Vue.component('e-bgimage', {
		props: ['value', 'eClass', 'maxSize', 'format'],
		template: `<div class="e-pos-rep e-image" @mouseenter="editOn" @mouseleave="editOff">
				<div :class="eClass" :style="'background-image: url(' + value + ');'"><slot></slot></div>
				<div v-if="isEdit" class="e-icon">
					<a class="e-icon-fa e-update" @click="upload"><i class="fa fa-edit"></i></a>
					<a class="e-icon-fa" @click="remove"><i class="fa fa-trash-o"></i></a>
				</div>
			</div>`,
		data: function() {
			return {
				e_format: accept(this.format || []),
				isEdit: false,
			}
		},
		methods: {
			editOn: function() {
				this.isEdit = true
			},
			editOff: function() {
				this.isEdit = false
			},
			upload: function() {
				errMsg()
			},
			remove: function() {
				errMsg()
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
}());
