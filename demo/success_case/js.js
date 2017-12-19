Vue.component('e-text', {
	props: {
		value: {
			type: String,
			required: 1
		}
	},
	template: '#e-text',
	data: function() {
		var me = this
		return {
			content: me.value,
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
	},
	watch: {
	},
	directives: {
		focus: {
			inserted: function (el) {
				el.focus()
			}
		}
	},
	mounted: function() {
	}
})
Vue.component('e-textarea', {
	props: {
		value: {
			type: String,
			required: 1
		}
	},
	template: '#e-textarea',
	data: function() {
		var me = this
		return {
			content: me.value,
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
			var me = this,
				v  = me.content
			v = v.length > 1000? v.substr(0, 1000): v
			v = v.replace(/(^\n*)|(\n*$)/g, '').replace(/\n+/g, '|*|')
			me.contentList = v.split('|*|')

			me.isEdit = me.isFocus = false
			me.$emit('input', me.content)
		},
	},
	watch: {
	},
	directives: {
		focus: {
			inserted: function (el) {
				el.focus()
			}
		}
	},
	mounted: function() {
		var me = this,
			v  = me.content
		v = v.length > 1000? v.substr(0, 1000): v
		v = v.replace(/(^\n*)|(\n*$)/g, '').replace(/\n+/g, '|*|')
		me.contentList = v.split('|*|')
	}
})


var VUE = new Vue({
	el: '#vApp',
	data: {
		title:     '恒大海上威尼斯',
		maintitle: '恒大海上威尼斯',
		subtitle:  '六年精髓，醉美碧海银滩',
		tab1_1:    '6200万+',
		tab1_2:    '广告曝光量',
		tab2_1:    '1854000',
		tab2_2:    '总互动次数',
		tab3_1:    '11000',
		tab3_2:    '总增粉人数',
		contitle:  '案例描述',
		condesc:   '恒大海上威尼斯先后通过三轮朋友圈广告的投放，展现“蓝海度假屋”的魅力，为三期开盘埋下伏笔，并带动看房人流，撬动潜在用户，加速目标用户的转化。此移动营销案例获得了2017年TopDigital创新银奖。\n第三期恒大海上威尼斯开盘广告一上线，就带来了6200W+的曝光，人均广告停留10.9秒，总互动185.4万次，总增粉达到1.1万人。'
	},
	methods: {
	}
})


